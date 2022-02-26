export class User {
    private _id!: number;  
    private _mediaDelCondado!: string;
    private _porcentajeDeCambioParaEnero!: string;
    private _date!: Date;
    private _nombreDelCondado!: string;
    private _condado!: number;

    public get id(): number {
        return this._id;
    }

    public set id(id: number) {
        this._id = id;
    }


    public get mediaDelCondado(): string {
        return this._mediaDelCondado;
    }

    public set mediaDelCondado(mediaDelCondado: string) {
        this._mediaDelCondado = mediaDelCondado;
    }

    public get porcentajeDeCambioParaEnero(): string {
        return this._porcentajeDeCambioParaEnero;
    }

    public set porcentajeDeCambioParaEnero(porcentajeDeCambioParaEnero: string) {
        this._porcentajeDeCambioParaEnero = porcentajeDeCambioParaEnero;
    }

    public get date(): Date {
        return this._date;
    }

    public set date(date: Date) {
        this._date = date;
    }

    public get nombreDelCondado(): string {
        return this._nombreDelCondado;
    }
    public set nombreDelCondado(nombreDelCondado: string) {
        this._nombreDelCondado = nombreDelCondado;
    }
    public get condado(): number {
        return this._condado;
    }

    public set condado(condado: number) {
        this._condado = condado;
    }

    public toJSON() {
        return {
          mediaDelCondado: this.mediaDelCondado,
          porcentajeDeCambioParaEnero : this.porcentajeDeCambioParaEnero, 
          date : this.date,
          id:this.id,
          nombreDelCondado : this.nombreDelCondado,
          condado : this.condado
        };
      }
  }
  
  