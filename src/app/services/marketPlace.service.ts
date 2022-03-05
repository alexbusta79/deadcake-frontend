import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Web3 from "web3";

declare const window: any;
let deadCakeTokenAbi = require('./deadCakeTokenABI.json');
let busdAbi = require('./busdABI.json');
let nftAbi = require('./nftABI.json');
let marketPlaceAbi = require('./marketPlaceABI.json');
let gameAbi = require('./gameABI.json');

@Injectable({
    providedIn: 'root'
})
export class MarketPlaceService {
    window:any;

    constructor(@Inject(DOCUMENT) private document: Document) {
        this.window = this.document.defaultView;
      }
    
    getAccounts = async () => {
        try {
            return await this.window.ethereum.request({ method: 'eth_accounts' });
        } catch (e) {
            return [];
        }
    }

    public openMetamask = async () => {
        if (this.window.ethereum) {
            this.window.web3 = new Web3(this.window.ethereum);
            this.window.ethereum.enable();
         }
    };

    public getAddress = async () => {
        this.window.web3 = new Web3(window.ethereum);
        let addresses = await this.getAccounts();
        if (!addresses.length) {
            try {
                addresses = await window.ethereum.enable();
            } catch (e) {
                return false;
            }
        }
        return addresses.length ? addresses[0] : null;
    };

    private deadCakeToken: string = "0xc98948F0dB29ced5dc23D88C0643e1737aBcD81C";
    private busdToken: string = "0x7C677A0D5473ae3629ee0667f9008354A5B34eC7";
    private nftContract: string = "0x9935D918343E7512a58A9Ea27f408dd921b40e77";
    private marketPlaceContract: string = "0xd136C58Ad2768D6ee0174eA6B653393fcf7ffe62";
    private gameContract: string = "0x7983BE84f0960015be189a77F2cE08821A4590eD";

    /* METODOS DEL NFT */
    public nftNoMinteados = async (idCaja: number ) => {
        try {
                const contract = new window.web3.eth.Contract(
                    nftAbi,
                    this.nftContract,
                );
                return await contract.methods.nftNoMinteados(idCaja).call();
        } catch (error) {
            console.log(error);
        }
    }
    
    public precioCaja = async (idCaja: number ) => {
        try {
                const contract = new window.web3.eth.Contract(
                    nftAbi,
                    this.nftContract,
                );
                return await contract.methods.precioDelNFT(idCaja).call();
        } catch (error) {
            console.log(error);
        }
    }
    
    public propietarioNFT = async ( ) => {
        try {
                const contract = new window.web3.eth.Contract(
                    nftAbi,
                    this.nftContract,
                );
                return await contract.methods.propietarioNFT(await this.getAddress()).call();
        } catch (error) {
            console.log(error);
        }
    }      

    /* METODOS DEL MARKETPLACE */      
    public mintNFT = async (idCaja: number ) => {
        try {
                const contract = new window.web3.eth.Contract(
                    marketPlaceAbi,
                    this.marketPlaceContract,
                );
                return await contract.methods.nftMint(idCaja).send({
                    from:  await this.getAddress()
                });
        } catch (error) {
            console.log(error);
        }
    }  

    /* METODOS DEL TOKEN DE PAGO BUSD */
    public aprobarEnvioTokensAlContrato = async (numeroTokens : number) => {
        try {
                const contract = new window.web3.eth.Contract(
                    busdAbi,
                    this.busdToken,
                );
                const aprobacion = await contract.methods.approve(this.marketPlaceContract,numeroTokens).send({
                    from: await this.getAddress()
                });
                return aprobacion; 
        } catch (error) {
            console.log(error);
        }
    }  

    /* METODOS DEL JUEGO */
    public reclamarRecompensa = async (idCaja : number) => {
        try {
                const contract = new window.web3.eth.Contract(
                    gameAbi,
                    this.gameContract,
                );
                await contract.methods.reclamarRecompensa(idCaja).send({ 
                    from: await this.getAddress()
                });
        } catch (error) {
            console.log(error);
        }
    }     
    public superadoTiempoDeFarming = async (idCaja : number) => {
        try {
                const contract = new window.web3.eth.Contract(
                    gameAbi,
                    this.gameContract,
                );
                let wallet = await this.getAddress(); 
                return await contract.methods.superadoTiempoDeFarming(wallet,idCaja).call();
        } catch (error) {
            console.log(error);
        }
    }  
    public recompensaAcumulada = async (idCaja : number) => {
        try {
                const contract = new window.web3.eth.Contract(
                    gameAbi,
                    this.gameContract,
                );
                let wallet = await this.getAddress(); 
                return await contract.methods.recompensaAcumulada(wallet,idCaja).call();
        } catch (error) {
            console.log(error);
        }
    }  
    public tiempoDeFarmingTotal = async (idCaja : number) => {
        try {
                const contract = new window.web3.eth.Contract(
                    gameAbi,
                    this.gameContract,
                );
                let wallet = await this.getAddress(); 
                return await contract.methods.tiempoDeFarmingTotal(wallet,idCaja).call();
        } catch (error) {
            console.log(error);
        }
    }       
    public balanceDelFarming = async () => {
        try {
                const contract = new window.web3.eth.Contract(
                    gameAbi,
                    this.gameContract,
                );
                let wallet = await this.getAddress(); 
                return await contract.methods.balanceOf(wallet).call();
        } catch (error) {
            console.log(error);
        }
    }  

    /* METODOS DEL DEAD CAKE TOKEN */
    public balanceDelToken = async () => {
        try {
                const contract = new window.web3.eth.Contract(
                    deadCakeTokenAbi,
                    this.deadCakeToken
                );
                let wallet = await this.getAddress(); 
                return await contract.methods.balanceOf(wallet).call();
        } catch (error) {
            console.log(error);
        }
    }  
}