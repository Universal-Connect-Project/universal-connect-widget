import type { NextFunction, Request, Response } from 'express';
import * as config from '../config';
import * as logger from './logger';
import { encrypt, decrypt } from '../utils';

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

function get(req: Request) {
  if (req.headers.meta?.length > 0) {
    const decrypted = decrypt(<string>req.headers.meta, config.CryptoKey, config.CryptoIv);
    req.context = JSON.parse(decrypted);
    req.context.updated = false;
  } else {
    req.context = {};
  }
  return req.context;
}

function set(res: Response) {
  if(res.context.updated){
    res.set('meta', encrypt(JSON.stringify(res.context), config.CryptoKey, config.CryptoIv));
  }
}

export function contextHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.context = get(req);
  // console.log('context res: ' + req.path)
  // console.log(res.context)
  const { send } = res;
  res.send = function (...args: any): any {
    res.send = send;
    set(res);
    send.apply(res, args);
    // console.log('context send: ' + req.path)
    // console.log(res.context)
  };
  next();
}
