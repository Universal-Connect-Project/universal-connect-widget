import * as crypto from 'crypto';
import type { NextFunction, Request, Response } from 'express';

import * as config from '../config';

declare global {
  namespace Express {
    interface Request {
      context?: import('../../shared/contract').Context;
    }
    interface Response {
      context?: import('../../shared/contract').Context;
    }
  }
}

const algorithm = config.CryptoAlgorithm;
const key = Buffer.from(config.CryptoKey, 'hex'); // crypto.randomBytes(32) todo redis
const iv = Buffer.from(config.CryptoIv, 'hex'); // crypto.randomBytes(16)

function encrypt(text: string) {
  if ((text || '') === '') {
    return '';
  }
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
  // return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text: string) {
  if ((text || '') === '') {
    return '';
  }
  const encryptedText = Buffer.from(text, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

function get(req: Request) {
  if ((req.headers.meta || '').length > 0) {
    const decrypted = decrypt(<string>req.headers.meta);
    req.context = JSON.parse(decrypted);
    if (!req.context.user_id) {
      req.context.user_id = config.MxDemoUserId;
    }
  } else {
    req.context = {};
  }
  return req.context;
}

function set(res: Response) {
  res.set('meta', encrypt(JSON.stringify(res.context)));
}

export function contextHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.context = get(req);
  const { send } = res;
  res.send = function (...args: any): any {
    res.send = send;
    set(res);
    send.apply(res, args);
  };
  next();
}
