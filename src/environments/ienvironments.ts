export class IEnvironment implements IEnvironmentParams {
    public production: boolean;
    public basicURL: string = 'http://localhost:4200';
    public siteName: string = 'DeadCake';
  
    constructor(params: IEnvironmentParams) {
      this.production = params.production ?? false;
      this.basicURL = params.basicURL ?? this.basicURL;
      this.siteName = params.siteName ?? this.siteName;
    }
  }
  
  export interface IEnvironmentParams {
    production: boolean;
    basicURL?: string;
    siteName?: string;
  }