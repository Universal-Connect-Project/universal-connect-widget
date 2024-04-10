import {AuthClient as UcpAuth} from './ucp'
import {AuthClient as SophtronAuth} from './ucp'
import {AuthClient as LocalAuth} from './local'
const config = require('../../config');

export function CreateAuthClient(token, authProvider){
  switch((config.AuthProvider || authProvider).toLowerCase() ){
    case 'sophtron':
      return new SophtronAuth(token);
    case 'local':
      return new LocalAuth(token);
    case 'ucp':
      return new UcpAuth(token);
    default:
      return new UcpAuth(token);
  }
}
