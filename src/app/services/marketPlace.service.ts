import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Web3 from "web3";

declare const window: any;
let tokenAbi = require('./tokenContract.json');
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
        console.log("service",addresses)
        if (!addresses.length) {
            try {
                addresses = await window.ethereum.enable();
            } catch (e) {
                return false;
            }
        }
        return addresses.length ? addresses[0] : null;
    };

    //private _tokenContractAddress: string = "0xDBb6b22e1BaBEec8B06564c306fed9ed82A51c58";
    //private busdToken: string = "0x41070b9F1300Af9a9fd6048394B3032CD09c7bc9";
    //private nftContract: string = "0x7670D131A526e210A4b6855b839D61b699AA85c9";
    //private marketPlaceContract: string = "0x62710565837D481Fe4aCD2B738Ebe5DdfA9c9423";

    private _tokenContractAddress: string = "0xDBb6b22e1BaBEec8B06564c306fed9ed82A51c58";
    private busdToken: string = "0xc3F487945a33c0C16280f7dE793765F7f4341EbC";
    private nftContract: string = "0xEB6F0934a821b24029b57765D1906A3BD98a3eD2";
    private marketPlaceContract: string = "0xC05B9668Bd3d320886B396F0D23B75a1EC2c0755";
    private gameContract: string = "0xE51716a9DCa1c9ad6AFb5E9Df76e35B312EFB5f2";

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
                const precioDelNFT = await contract.methods.precioDelNFT(idCaja).call();
                console.log("precioDelNFT - Caja " + idCaja,precioDelNFT);
                return precioDelNFT; 
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

                const mintNFT = await contract.methods.nftMint(idCaja).send({
                    from:  await this.getAddress()
                });
                console.log("mintNFT - Caja " + idCaja,mintNFT);
                return mintNFT; 
        } catch (error) {
            console.log(error);
        }
    }  

    /* METODOS DEL TOKEN */
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
                await contract.methods.reclamarRecompenza(idCaja).send({ 
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



    public Nft = async () => {
        try {
                const contract = new window.web3.eth.Contract(
                    nftAbi,
                    this.nftContract,
                );
                const token = await contract.methods.name().call();
                console.log("token2",token);
                const nftNoMinteados = await contract.methods.nftNoMinteados(1).call();
                console.log("nftNoMinteados",nftNoMinteados);
               /*
               var to ="0x7d9D3a6b025633770751c792CD69e08cB36841a4";
                const token = await contract.methods.totalSupply().call();  
                const token2 = await contract.methods.transfer(to,1000).send({
                    from: await this.getAddress()
                });
                console.log("token2",token2);
                return token; */
        } catch (error) {
            console.log(error);
        }
    }  

    public Test = async () => {
        try {
                const contract = new window.web3.eth.Contract(
                    busdAbi,
                    this.busdToken,
                );
               // const token = await contract.methods.name().call();

               var to ="0x7d9D3a6b025633770751c792CD69e08cB36841a4";
//var isAddress = window.web3.isAddress(to);
//console.log(window.web3.eth.coinbase);
const token = await contract.methods.totalSupply().call(); 
                const token2 = await contract.methods.transfer(to,1000).send({
                    from: await this.getAddress()
                });
                console.log("token2",token2);
                return token; 
        } catch (error) {
            console.log(error);
        }
    }  

    public Token = async () => {
        try {
                const contract = new window.web3.eth.Contract(
                    tokenAbi,
                    this._tokenContractAddress,
                );
               // const token = await contract.methods.name().call();

               var to ="0x7d9D3a6b025633770751c792CD69e08cB36841a4";
var value = 10;
//var isAddress = window.web3.isAddress(to);
//console.log(window.web3.eth.coinbase);
const token = await contract.methods.totalSupply().call(); 
                const token2 = await contract.methods.transfer(to,1000).send({
                    from: await this.getAddress()
                });
                console.log("token2",token2);
                return token; 
        } catch (error) {
            console.log(error);
        }
    }  
}