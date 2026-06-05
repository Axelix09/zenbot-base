/*
 * © Created by AxelDev09 🔥
 * GitHub: https://github.com/AxelDev09
 * Instagram: @axeldev09
 */

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';

export const THEMES = { Character: 1, Animals: 14, Objects: 2 };
export const ANSWERS = { Yes: 0, No: 1, IDontKnow: 2, Probably: 3, ProbablyNot: 4 };
const LANGS = ['en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'ru', 'ar', 'cn', 'tr', 'pl', 'jp'];

class AkiClient {
  constructor(lang) {
    this.base = `https://${lang}.akinator.com`;
    this.cookies = new Map();

    this.headers = {
      'User-Agent': UA,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'es-AR,es;q=0.9,en-US;q=0.8,en;q=0.7',
      'Sec-Ch-Ua': '"Chromium";v="123", "Not:A-Brand";v="8", "Google Chrome";v="123"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Linux"',
      'Upgrade-Insecure-Requests': '1',
      'Connection': 'keep-alive'
    };
  }

  _updateCookies(res) {
    let rawCookies = [];
    if (typeof res.headers.getSetCookie === 'function') {
      rawCookies = res.headers.getSetCookie();
    } else {
      res.headers.forEach((val, key) => {
        if (key.toLowerCase() === 'set-cookie') {
          rawCookies.push(...val.split(/,(?=\s*[a-zA-Z0-9_-]+\=)/));
        }
      });
    }

    for (const cookieStr of rawCookies) {
      const parts = cookieStr.split(';');
      const [key, ...valParts] = parts[0].split('=');
      const value = valParts.join('=');
      if (key && value) {
        this.cookies.set(key.trim(), value.trim());
      }
    }
  }

  getCookieString() {
    return Array.from(this.cookies.entries()).map(([k, v]) => `${k}=${v}`).join('; ');
  }

  async get(url) {
    const headers = { ...this.headers };
    const cookieStr = this.getCookieString();
    if (cookieStr) headers['Cookie'] = cookieStr;

    const res = await fetch(url, { headers, method: 'GET' });
    this._updateCookies(res);
    return await res.text();
  }

  async post(url, data) {
    const headers = {
      ...this.headers,
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Origin': this.base,
      'Referer': `${this.base}/game`,
      'X-Requested-With': 'XMLHttpRequest'
    };
    const cookieStr = this.getCookieString();
    if (cookieStr) headers['Cookie'] = cookieStr;

    const body = new URLSearchParams(data).toString();

    const res = await fetch(url, { headers, method: 'POST', body });
    this._updateCookies(res);
    
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
}

class AkinatorSession {
  #client;
  #session;
  #signature;
  #theme;
  #step;
  #progression;
  #currentQuestion;
  #won;
  #proposition;

  constructor(client, session, signature, theme, question) {
    this.#client = client;
    this.#session = session;
    this.#signature = signature;
    this.#theme = theme;
    this.#step = '0';
    this.#progression = '0.00000';
    this.#currentQuestion = question;
    this.#won = false;
    this.#proposition = null;
  }

  getQuestion() { return this.#currentQuestion; }
  getStep() { return parseInt(this.#step); }
  getProgression() { return parseFloat(this.#progression); }
  isWon() { return this.#won; }
  getProposition() { return this.#proposition; }

  async answer(answer) {
    if (this.#won) throw new Error('La sesión ya terminó con una proposición');

    const params = {
      step: this.#step,
      progression: this.#progression,
      sid: this.#theme,
      cm: 'false',
      answer: String(answer),
      step_last_proposition: '',
      session: this.#session,
      signature: this.#signature
    };

    const data = await this.#client.post(`${this.#client.base}/answer`, params);

    if (data.completion && data.completion !== 'OK') {
      throw new Error(`Akinator error: ${data.completion}`);
    }

    if (data.step) this.#step = data.step;
    if (data.progression) this.#progression = data.progression;
    if (data.question) this.#currentQuestion = data.question;

    if (data.id_proposition) {
      this.#won = true;
      this.#proposition = {
        id: data.id_proposition,
        name: data.name_proposition,
        description: data.description_proposition,
        photo: data.photo,
        pseudo: data.pseudo
      };
    }

    return {
      step: parseInt(this.#step),
      progression: parseFloat(this.#progression),
      question: this.#currentQuestion,
      won: this.#won,
      proposition: this.#proposition
    };
  }

  async back() {
    if (parseInt(this.#step) === 0) throw new Error('Ya estás en el paso 0');

    const params = {
      step: this.#step,
      progression: this.#progression,
      sid: this.#theme,
      cm: 'false',
      session: this.#session,
      signature: this.#signature
    };

    const data = await this.#client.post(`${this.#client.base}/cancel_answer`, params);

    if (data.step) this.#step = data.step;
    if (data.progression) this.#progression = data.progression;
    if (data.question) this.#currentQuestion = data.question;
    this.#won = false;
    this.#proposition = null;

    return {
      step: parseInt(this.#step),
      progression: parseFloat(this.#progression),
      question: this.#currentQuestion
    };
  }
}

export async function akinator(lang = 'es', theme = THEMES.Character) {
  if (!LANGS.includes(lang)) throw new Error(`Idioma no soportado: ${lang}`);

  const client = new AkiClient(lang);
  const html = await client.get(client.base);

  if (html.includes('Attention Required') || html.includes('cf-error') || html.includes('Cloudflare')) {
    throw new Error('Cloudflare bloqueó la conexión. La IP del hosting está manchada.');
  }

  const params = { sid: theme, cm: 'false' };
  const gameHtml = await client.post(`${client.base}/game`, params);

  const htmlStr = typeof gameHtml === 'string' ? gameHtml : JSON.stringify(gameHtml);

  if (htmlStr.includes('Attention Required') || htmlStr.includes('cf-error')) {
    throw new Error('Cloudflare bloqueó el inicio del juego.');
  }

  const sessionMatch   = htmlStr.match(/name="session" id="session" value="([^"]+)"/);
  const signatureMatch = htmlStr.match(/name="signature" id="signature" value="([^"]+)"/);
  const questionMatch  = htmlStr.match(/<p class="question-text" id="question-label">(.*?)<\/p>/);

  if (!sessionMatch || !signatureMatch) {
    throw new Error('No se pudo extraer la sesión de Akinator. (Posible baneo de IP).');
  }

  const session   = sessionMatch[1];
  const signature = signatureMatch[1];
  const question  = questionMatch?.[1] ?? '';

  return new AkinatorSession(client, session, signature, theme, question);
}