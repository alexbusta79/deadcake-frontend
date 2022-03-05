// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BUSDToken is ERC20 {
    constructor() ERC20("BUSD Token", "BUSD") {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }
}

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract DeadCakeNFT is  ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _nftIds;

    uint8 private decimalesBUSD = 18;
    // Roles del Contrato  
    mapping(address => bool ) private roles;
    // ID_NFT y su Precio    
    mapping(uint256 => uint256 ) private preciosNFT;
    // Numero total de NFT por tipologia 
    uint256 private numeroTotalDeNFTPorTipo = 10000; 
    // Lista IDs NFT  vs TIPO NFT  
    mapping(uint256 => uint8 ) private listaIdNFTPorTipo;
    // Propiedad NFT
    struct PropiedadNFT {
        uint8 caja1;   
        uint8 caja2;
        uint8 caja3;  
    } 
    mapping(address => PropiedadNFT ) private propietariosNFT;    
    // Representa la unica Caja
    struct Caja {
        uint256 nftMinteados;   
        uint256 precio;
        uint256 nftNoMinteados; 
        string[6] uri;    
    }
    Caja[4] private cajas;   

    constructor(uint256[3] memory _precios,string[6] memory _tokensUriCaja1,string[4] memory _tokensUriCaja2,string[4] memory _tokensUriCaja3) ERC721("DeadCakeNFT", "DCK") {     
        configuracionInicialCajas(_precios,_tokensUriCaja1,_tokensUriCaja2,_tokensUriCaja3);
    }

    modifier onlyUser() {
        require(isUser(msg.sender), "Restringido solo a Usuarios");
        _;
    }

    function agregarUser(address account) public onlyOwner {
        roles[account] = true;  
    }

    function borrarUser(address account) public onlyOwner {
        roles[account] = false; 
    }

    function isUser(address account)  public view returns (bool) {
        require(roles[account] == true, "Restringido solo a Usuarios");
        return true;
    }

    function cambiarPreciosCajasNFT(uint256[3] memory precios) external onlyOwner {
        cambiarPreciosCajas(precios);
    }

    function cambiarPreciosNFT(uint256 _idNFT,  uint256 precioNFT) external returns (bool) {
       require(msg.sender == ownerOf(_idNFT), "Cambio del precio autorizado solo al Propietario del NFT");
        preciosNFT[_idNFT] = precioNFT * 10 ** decimalesBUSD;
        return true; 
    }    

    function mintNFT(address recipient, uint8 _cajaID, uint256 precioNFT) external onlyUser returns (uint256) {
        _nftIds.increment();

        uint256 nuevoIdNFT = _nftIds.current();

        _mint(recipient, nuevoIdNFT);
        _setTokenURI(nuevoIdNFT, obtenerCaja(_cajaID));

        listaIdNFTPorTipo[nuevoIdNFT] = _cajaID; 
        cajas[_cajaID].nftMinteados = cajas[_cajaID].nftMinteados + 1; 
        cajas[_cajaID].nftNoMinteados = cajas[_cajaID].nftNoMinteados - 1; 

        preciosNFT[nuevoIdNFT] = precioNFT;

        incrementarPropiedadNFT(recipient,_cajaID);

        return nuevoIdNFT;
    }

    function incrementarPropiedadNFT(address propietario, uint8 _cajaID) internal {
        if(_cajaID == 1) {
            propietariosNFT[propietario].caja1 = propietariosNFT[propietario].caja1 + 1;
        }
        if(_cajaID == 2) {
            propietariosNFT[propietario].caja2 = propietariosNFT[propietario].caja2 + 1;
        }
        if(_cajaID == 3) {
            propietariosNFT[propietario].caja3 = propietariosNFT[propietario].caja3 + 1;
        }        
    }

    function decrementarPropiedadNFT(address propietario, uint8 _cajaID) internal {
        if(_cajaID == 1) {
            propietariosNFT[propietario].caja1 = propietariosNFT[propietario].caja1 - 1;
        }
        if(_cajaID == 2) {
            propietariosNFT[propietario].caja2 = propietariosNFT[propietario].caja2 - 1;
        }
        if(_cajaID == 3) {
            propietariosNFT[propietario].caja3 = propietariosNFT[propietario].caja3 - 1;
        }        
    }

    function random(uint8 number) internal view returns(uint){
        return uint(keccak256(abi.encodePacked(block.timestamp,block.difficulty,msg.sender))) % number;
    }

    function obtenerCaja(uint8 _cajaID) internal view returns(string memory val){
        uint8 number = (_cajaID > 0 && _cajaID < 2) ? 6 : 3;
        return cajas[_cajaID].uri[random(number)]; 
    }

    function transferNFT(address vendedor, address comprador, uint256 _idNFT) external onlyUser {
        require(vendedor == ownerOf(_idNFT), "Solo puede vender el Propietario del NFT");
        _transfer(vendedor, comprador, _idNFT);

        uint8 cajaId = tipoCajaNFT(_idNFT);
        incrementarPropiedadNFT(comprador,cajaId);
        decrementarPropiedadNFT(vendedor,cajaId);
    }
  
    function propietarioNFT (address  propietario) public view returns (PropiedadNFT memory propiedadTotal) {
        return propietariosNFT[propietario];
    }

    function tipoCajaNFT (uint256 _nftId) public view returns (uint8 tipoNFT) {
        require(_existeNft(_nftId),"Este NFT no existe !!!!");
        return listaIdNFTPorTipo[_nftId];
    }

    function precioDelNFT (uint8 _cajaID) external view returns (uint256 precioNft) {
        require(_existeCajaNft(_cajaID),"Esta caja de NFT no Existe !!!! ");
        return cajas[_cajaID].precio;
    }

    function precioDelNFTEnMarketPlace (uint256 _nftId) external view returns (uint256 precioNft) {
        require(_existeNft(_nftId),"Este NFT no existe !!!! ");
        return preciosNFT[_nftId];
    }    

    function nftMinteados (uint8 _cajaID) external view returns (uint256 nftMint) {
        require(_existeCajaNft(_cajaID),"Esta caja de NFT no Existe !!!! ");
        return cajas[_cajaID].nftMinteados;
    }

    function nftNoMinteados (uint8 _cajaID) external view returns (uint256 nftNoMint) {
        require(_existeCajaNft(_cajaID),"Esta caja de NFT no Existe !!!! ");
        return cajas[_cajaID].nftNoMinteados;
    }

    function _existeCajaNft (uint8 _cajaID) private pure returns (bool existeCajaNft) {
      return _cajaID > 0 && _cajaID < 4;
    }  

    function _existeNft (uint256 _nftId) private view returns (bool existsNft) {
      return listaIdNFTPorTipo[_nftId] > 0;
    }  


    function configuracionInicialCajas(uint256[3] memory precios,string[6] memory _tokensUri1,string[4] memory _tokensUri2,string[4] memory _tokensUri3 ) private {
       cajas[1] = Caja({
            nftMinteados: 0,
            precio : precios[0] * 10 ** decimalesBUSD, 
            nftNoMinteados : numeroTotalDeNFTPorTipo,
            uri : [_tokensUri1[0], _tokensUri1[1],_tokensUri1[2],_tokensUri1[3],_tokensUri1[4],_tokensUri1[5]]
        });
        cajas[2] = Caja({
            nftMinteados: 0,
            precio : precios[1] * 10 ** decimalesBUSD, 
            nftNoMinteados : numeroTotalDeNFTPorTipo,
            uri : [_tokensUri2[0], _tokensUri2[1],_tokensUri2[2],"","",""]
        });   
        cajas[3] = Caja({
            nftMinteados: 0,
            precio : precios[2] * 10 ** decimalesBUSD, 
            nftNoMinteados : numeroTotalDeNFTPorTipo,
            uri : [_tokensUri3[0], _tokensUri3[1],_tokensUri3[2],"","",""]
        });                      
    }

    function cambiarPreciosCajas (uint256[3] memory precios) private {
        cajas[1].precio = precios[0] * 10 ** decimalesBUSD; 
        cajas[2].precio = precios[1] * 10 ** decimalesBUSD; 
        cajas[3].precio = precios[2] * 10 ** decimalesBUSD;
    }
}

contract DeadCakeGame is ERC20, Ownable {
    // Roles del Contrato  
    mapping(address => bool ) private roles;
    uint8 private decimalesTotales = 10;
    struct TiempoMicroondas {
        uint256 caja1;
        uint256 caja2;
        uint256 caja3;
    }
    struct GananciaPorSegundo {
        uint256 caja1;
        uint256 caja2;
        uint256 caja3;
    }
    mapping(address => TiempoMicroondas) private listaDeFarming;
    uint256 private configuracionTiempoDeFarming ; 
    GananciaPorSegundo public gananciasPorSegundoMicroondas; 
    event FarmingActivo(address inversor, uint8 microondas);
    event ReclamoRecompensa(address inversor, uint8 microondas, uint256 cantidad);

    /*  CAJA 1 =   626929 
        CAJA 2 =  1215278
        CAJA 3 =  3885582 
    */
    constructor(uint256 tiempoParaRecompensas,  uint256[] memory gananciasAlSegundo) ERC20("Dead Cake Token", "DCKT") {
        _mint(msg.sender, 1000 * 10 ** decimalesTotales); 
		configuracionTiempoDeFarming = tiempoParaRecompensas;
        roles[msg.sender] = true;   
        _cambiarGananciasAlSegundo(gananciasAlSegundo);
    }  

    modifier onlyUser() {
        require(isUser(msg.sender), "Restringido solo a Usuarios");
        _;
    }

    function cambiarGananciasAlSegundo(uint256[] memory gananciasAlSegundo) public onlyOwner {
        _cambiarGananciasAlSegundo(gananciasAlSegundo); 
    }

    function _cambiarGananciasAlSegundo(uint256[] memory gananciasAlSegundo) internal {
        gananciasPorSegundoMicroondas.caja1 = gananciasAlSegundo[0]; 
        gananciasPorSegundoMicroondas.caja2 = gananciasAlSegundo[1]; 
        gananciasPorSegundoMicroondas.caja3 = gananciasAlSegundo[2];  
    }

    function agregarUser(address account) public onlyOwner {
        roles[account] = true;  
    }

    function borrarUser(address account) public onlyOwner {
        roles[account] = false; 
    }
	
    function isUser(address account)  public view returns (bool) {
        require(roles[account] == true, "Restringido solo a Usuarios");
        return true;
    }
	
    function farming(address addressFarming, uint8 cajaId) external onlyUser {
        require(cajaId > 0 && cajaId < 4 , "La caja no existe");
        uint256 tokensAReclamar = recompensaAcumulada(addressFarming,cajaId);
        if(tokensAReclamar > 0) {
            _mint(addressFarming, tokensAReclamar);
            emit ReclamoRecompensa(addressFarming,cajaId,tokensAReclamar);
        }
        if(cajaId == 1) {
            listaDeFarming[addressFarming].caja1 =  block.timestamp;
        }
        if(cajaId == 2) {
            listaDeFarming[addressFarming].caja2 =  block.timestamp;
        }
        if(cajaId == 3) {
            listaDeFarming[addressFarming].caja3 =  block.timestamp;
        }
        emit FarmingActivo(addressFarming,cajaId);
    }

	function reclamarRecompensa(uint8 cajaId) public {
        require(cajaId > 0 && cajaId < 4 , "La caja no existe");
        require(superadoTiempoDeFarming(msg.sender,cajaId), "No superado el tiempo para reclamar");
        uint256 tokensAReclamar = recompensaAcumulada(msg.sender,cajaId);
        resetTiempoDeFarming(msg.sender,cajaId);
        _mint(msg.sender, tokensAReclamar);
        emit ReclamoRecompensa(msg.sender,cajaId,tokensAReclamar); 
    }

    function superadoTiempoDeFarming(address addressFarming,uint8 cajaId) view public returns(bool){
        return tiempoDeFarming(addressFarming,cajaId) > configuracionTiempoDeFarming;
    }

    function recompensaAcumulada(address addressFarming,uint8 cajaId) view public returns(uint256 recompensa){
        require(cajaId > 0 && cajaId < 4 , "La caja no existe");
        if(cajaId == 1) {
            return tiempoDeFarming(addressFarming,cajaId) * gananciasPorSegundoMicroondas.caja1;
        }
        if(cajaId == 2) {
            return tiempoDeFarming(addressFarming,cajaId) * gananciasPorSegundoMicroondas.caja2;
        }
        if(cajaId == 3) {
            return  tiempoDeFarming(addressFarming,cajaId) * gananciasPorSegundoMicroondas.caja3;
        }
    }

    function tiempoDeFarmingTotal(address addressFarming,uint8 cajaId) view external returns(uint256){
        return tiempoDeFarming(addressFarming,cajaId);
    }

    function resetTiempoDeFarming(address addressFarming, uint8 cajaId) internal {
        if(cajaId == 1 && listaDeFarming[addressFarming].caja1 > 0 ) {
            listaDeFarming[addressFarming].caja1 =  block.timestamp;
        }
        if(cajaId == 2 && listaDeFarming[addressFarming].caja2 > 0) {
            listaDeFarming[addressFarming].caja2 =  block.timestamp;
        }
        if(cajaId == 3 && listaDeFarming[addressFarming].caja3 > 0) {
            listaDeFarming[addressFarming].caja3 =  block.timestamp;
        }        
    }

    function tiempoDeFarming(address addressFarming, uint8 cajaId)  view internal returns(uint256 farmado) {
        if(cajaId == 1 && listaDeFarming[addressFarming].caja1 > 0 ) {
            return block.timestamp - listaDeFarming[addressFarming].caja1;
        }
        if(cajaId == 2 && listaDeFarming[addressFarming].caja2 > 0) {
            return block.timestamp - listaDeFarming[addressFarming].caja2;
        }
        if(cajaId == 3 && listaDeFarming[addressFarming].caja3 > 0) {
            return block.timestamp - listaDeFarming[addressFarming].caja3;
        }        
    }

    function decimals() public view virtual override returns (uint8) {
        return decimalesTotales;
    } 
}

contract NFTMarketPlace {
    IERC20 private tokenBUSD;
    DeadCakeNFT private NFT;
    DeadCakeGame private GAME;
    mapping(uint256 => bool) private idNFTEnVenta;
    event MintNFT(address _minteador,uint256 _idNFT);
    event BuyNFT(address _vendedor, address _comprador, uint256 _idNFT,uint256 _precio);
    event FarmingNFT(address _farmeador,uint256 _idCaja);

    constructor (address tokenAddress, address NFTAddress, address GAMEAddress)  {
        tokenBUSD = IERC20(address(tokenAddress));  
        NFT = DeadCakeNFT(NFTAddress);    
        GAME =  DeadCakeGame(GAMEAddress);
    }

    function nftMint(uint8 _boxId) external returns (uint256) {
        uint precioNFT = NFT.precioDelNFT(_boxId);
        require(tokenBUSD.balanceOf(msg.sender) >= precioNFT, "Insuficiente balance.");   
        tokenBUSD.transferFrom(msg.sender,NFT.owner(),precioNFT);
        uint256 idNFT = NFT.mintNFT(msg.sender,_boxId,precioNFT); 
        emit MintNFT(msg.sender, idNFT);
        GAME.farming(msg.sender,_boxId);
        emit FarmingNFT(msg.sender,_boxId);

        return idNFT;
    }  

    function venderNFT(uint256 _idNFT,bool vender) external returns (bool) {
        require(msg.sender == NFT.ownerOf(_idNFT),"Solo el propietario del NFT puede venderlo");
        idNFTEnVenta[_idNFT] = vender;
        return true; 
    }    

    function nftBuy(uint256 _idNFT) external returns (bool) {
        require(idNFTEnVenta[_idNFT],"El Token se tiene que meter a la venta antes");
        uint256 precioNFT = NFT.precioDelNFTEnMarketPlace(_idNFT);
        require(tokenBUSD.balanceOf(msg.sender) >= precioNFT, "Insuficiente balance.");

        address propietarioNFT = NFT.ownerOf(_idNFT);

        tokenBUSD.transferFrom(msg.sender,propietarioNFT,precioNFT);

        NFT.transferNFT(propietarioNFT, msg.sender, _idNFT);

        idNFTEnVenta[_idNFT] = false;

        emit BuyNFT(propietarioNFT, msg.sender, _idNFT, precioNFT);

        return true; 
    }
}