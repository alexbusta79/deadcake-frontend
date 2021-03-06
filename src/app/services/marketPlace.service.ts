import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import Web3 from "web3";
import { environment } from 'src/environments/environment';

declare const window: any;
let deadCakeTokenAbi = require('./deadCakeTokenABI.json');
let busdAbi = require('./busdABI.json');
let nftAbi = require('./nftABI.json');
let marketPlaceAbi = require('./marketPlaceABI.json');
let gameAbi = require('./gameABI.json');
let SERVER_URL = `${environment.basicURL}`;

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
       // if (this.window.ethereum) {
            this.window.web3 = new Web3(window.ethereum);
            return await window.ethereum.enable();
        // }
    };

    public getAddress = async () => {
        this.window.web3 = new Web3(window.ethereum);
        let addresses = await this.getAccounts();
        return addresses.length ? addresses[0] : null;
    };

    private deadCakeToken: string = "0xA7Bf2fa31b9BaBbB8145e95e16E9f8ba9c6BF84B";
    private busdToken: string = "0x736a116fD1A805A22c2A832b2DCc68D445D184B3";
    private nftContract: string = "0xE8436205e77f79b7830D516007d983b7fdC16433";
    private marketPlaceContract: string = "0xe1A2d540634B47Ed1CAF68079D321810D5745534";
    private gameContract: string = "0x2483904AedfFe3A8F28A8B869cc69891a5028Faa";

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
            return 0; 
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
            return 0; 
        }
    }
    
    public propietarioNFT = async (idCaja: number ) => {
        try {
                const contract = new window.web3.eth.Contract(
                    nftAbi,
                    this.nftContract,
                );
                let direccion = await this.getAddress();
                return direccion != null ? await contract.methods.propietarioNFT(direccion,idCaja).call() : null;
            } catch (error) {
            console.log(error);
            return 0; 
        }
    }      

    public balanceDelNFT = async ( ) => {
        try {
                const contract = new window.web3.eth.Contract(
                    nftAbi,
                    this.nftContract,
                );
                let direccion = await this.getAddress();
                return direccion != null ? await contract.methods.balanceOf(direccion).call() : null;
        } catch (error) {
            console.log(error);
            return 0; 
        }
    }      

    /* METODOS DEL MARKETPLACE */      
    public mintNFT = async (idCaja: number ) => {
        try {
                const contract = new window.web3.eth.Contract(
                    marketPlaceAbi,
                    this.marketPlaceContract,
                );
              
                let direccion = await this.getAddress();
                return direccion != null ? await contract.methods.nftMint(idCaja).send({
                    from:  direccion
                }) : null;          
        } catch (error) {
            console.log(error);
            return null; 
        }
    }  

    /* METODOS DEL TOKEN DE PAGO BUSD */
    public aprobarEnvioTokensAlContrato = async (numeroTokens : number) => {
        try {
                const contract = new window.web3.eth.Contract(
                    busdAbi,
                    this.busdToken,
                );
                let direccion = await this.getAddress();
                const aprobacion = direccion != null ? await contract.methods.approve(this.marketPlaceContract,numeroTokens).send({
                    from: direccion
                }) : null; 
                return aprobacion; 
        } catch (error) {
            console.log(error);
            return null; 
        }
    }  

    /* METODOS DEL JUEGO */
    public reclamarRecompensa = async (idCaja : number) => {
        try {
                const contract = new window.web3.eth.Contract(
                    gameAbi,
                    this.gameContract,
                );
                let direccion = await this.getAddress();
                return direccion != null ? await contract.methods.reclamarRecompensa(idCaja).send({ 
                    from: direccion
                }) : null; 
        } catch (error) {
            console.log(error);
            return null; 
        }
    }     
    public superadoTiempoDeFarming = async (idCaja : number) => {
        try {
                const contract = new window.web3.eth.Contract(
                    gameAbi,
                    this.gameContract,
                );
                let direccion = await this.getAddress();
                return direccion != null ? 
                await contract.methods.superadoTiempoDeFarming(direccion,idCaja).call() : 0; 
        } catch (error) {
            console.log(error);
            return 0; 
        }
    }  
    public recompensaAcumulada = async (idCaja : number) => {
        try {
                const contract = new window.web3.eth.Contract(
                    gameAbi,
                    this.gameContract,
                );
                let direccion = await this.getAddress();
                return direccion != null ? 
                await contract.methods.recompensaAcumulada(direccion,idCaja).call() : null;
        } catch (error) {
            console.log(error);
            return null; 
        }
    }  
    public tiempoDeFarmingTotal = async (idCaja : number) => {
        try {
                const contract = new window.web3.eth.Contract(
                    gameAbi,
                    this.gameContract,
                );
                let direccion = await this.getAddress();
                return direccion != null ? 
                await contract.methods.tiempoDeFarmingTotal(direccion,idCaja).call() : null; 
        } catch (error) {
            console.log(error);
            return null; 
        }
    }     
    
    public tiempoDeFarming = async () => {
        try {
                const contract = new window.web3.eth.Contract(
                    gameAbi,
                    this.gameContract,
                );
                return await contract.methods.tiempoDeFarming().call();
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
                let direccion = await this.getAddress();
                return direccion != null ? 
                await contract.methods.balanceOf(direccion).call() : null; 
        } catch (error) {
            console.log(error);
            return null; 
        }
    }  

    /* METODOS DEL DEAD CAKE TOKEN */
    public balanceDelToken = async () => {
        try {
                const contract = new window.web3.eth.Contract(
                    deadCakeTokenAbi,
                    this.deadCakeToken
                );
                let direccion = await this.getAddress(); 
                return direccion != null ? await contract.methods.balanceOf(direccion).call() : 0; 
        } catch (error) {
            console.log(error);
            return 0; 
        }
    }  


    /* METODOS Para agregar Tokens en Metamask */
    public agregarIconDeadCakeToken = async () => {
        let tokenSymbol = 'DCK';
        let tokenDecimals = 3;
        let tokenImage = SERVER_URL+"/assets/images/logo_token_dck.png";
        try {
            const wasAdded = await this.window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', 
                options: {
                address: this.deadCakeToken, 
                symbol: tokenSymbol, 
                decimals: tokenDecimals, 
                image: tokenImage, 
                },
            },
            });
        } catch (error) {
            console.log(error);
        }
    }  
    public agregarIconDeadCakeFarming = async () => {
        let tokenSymbol = 'DCKT';
        let tokenDecimals = 10;
        let tokenImage = SERVER_URL+"/assets/images/Icon_DCK_model_farming.png";
        try {
            const wasAdded = await this.window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', 
                options: {
                address: this.gameContract, 
                symbol: tokenSymbol, 
                decimals: tokenDecimals, 
                image: tokenImage, 
                },
            },
            });
        } catch (error) {
            console.log(error);
        }
    }  

    public agregarIconDeadCakeNFT = async () => {
        let tokenSymbol = 'DCK';
        let tokenDecimals = 0;
        let tokenImage = SERVER_URL+"/assets/images/Icon_DCK_model_nft.png";
        try {
            const wasAdded = await this.window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', 
                options: {
                address: this.nftContract, 
                symbol: tokenSymbol, 
                decimals: tokenDecimals, 
                image: tokenImage, 
                },
            },
            });
        } catch (error) {
            console.log(error);
        }
    }  

}