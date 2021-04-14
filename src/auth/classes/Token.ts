export class Token {
  iss:string
  sub:Number;

  constructor(sub: Number){
    this.iss = 'social_network_api'
    this.sub = sub;
  }
}