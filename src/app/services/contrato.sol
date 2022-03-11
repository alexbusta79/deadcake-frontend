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
    struct NFT {
        uint8 cantidad;   
        uint256[] nftIds;    
    }
    mapping (address => mapping (uint8 => NFT)) private propietariosNFT;

    // Representa la unica Caja
    struct Caja {
        uint256 nftMinteados;   
        uint256 precio;
        uint256 nftNoMinteados; 
        string[6] uri;    
    }
    Caja[4] private cajas;   

   event MintNFT(address propietario, uint8 idCaja, uint256 idNFT);
   event VentaNFT(address vendedor,address comprador, uint8 idCaja, uint256 idNFT);

    constructor(uint256[3] memory _precios,string[6] memory _tokensUriCaja1,string[4] memory _tokensUriCaja2,string[4] memory _tokensUriCaja3) ERC721("DeadCakeNFT", "DCK") {     
        configuracionInicialCajas(_precios,_tokensUriCaja1,_tokensUriCaja2,_tokensUriCaja3);
    }

    modifier onlyUser() {
        require(isUser(msg.sender), "Restringido solo a Usuarios");
        _;
    }

    modifier cajasValidas(uint8 cajaId) {
        require(cajaId > 0 && cajaId < 4 , "La caja NFT no existe");
        _;
    }

    modifier existeNft(uint256 _nftId) {
        require(listaIdNFTPorTipo[_nftId] > 0, "La caja NFT no existe");
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

    function mintNFT(address recipient, uint8 _cajaID, uint256 precioNFT) external onlyUser cajasValidas(_cajaID) returns (uint256) {
        _nftIds.increment();

        uint256 nuevoIdNFT = _nftIds.current();

        _mint(recipient, nuevoIdNFT);
        _setTokenURI(nuevoIdNFT, obtenerCaja(_cajaID));

        listaIdNFTPorTipo[nuevoIdNFT] = _cajaID; 
        cajas[_cajaID].nftMinteados = cajas[_cajaID].nftMinteados + 1; 
        cajas[_cajaID].nftNoMinteados = cajas[_cajaID].nftNoMinteados - 1; 

        preciosNFT[nuevoIdNFT] = precioNFT;

        propietariosNFT[recipient][_cajaID].cantidad += 1; 
        propietariosNFT[recipient][_cajaID].nftIds.push(nuevoIdNFT);   

        emit MintNFT(recipient,_cajaID,nuevoIdNFT);

        return nuevoIdNFT;
    }

    function decrementarPropiedadNFT(address propietario, uint8 _cajaID) internal {
        propietariosNFT[propietario][_cajaID].cantidad -= 1; 
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

        propietariosNFT[comprador][cajaId].cantidad += 1;
        propietariosNFT[comprador][cajaId].nftIds.push(_idNFT);   

        propietariosNFT[vendedor][cajaId].cantidad -= 1;
        propietariosNFT[vendedor][cajaId].nftIds.pop();

        emit VentaNFT(vendedor,comprador, cajaId,_idNFT);        
    }
  
    function propietarioNFT (address propietario, uint8 idCaja) public view returns ( NFT memory propiedadTotalPorCaja) {
         return propietariosNFT[propietario][idCaja]; 
    }

    function tipoCajaNFT (uint256 _nftId) public existeNft(_nftId) view returns (uint8 tipoNFT) {
        return listaIdNFTPorTipo[_nftId];
    }

    function precioDelNFT (uint8 _cajaID) external cajasValidas(_cajaID) view returns (uint256 precioNft) {
        return cajas[_cajaID].precio;
    }

    function precioDelNFTEnMarketPlace (uint256 _nftId) external existeNft(_nftId) view returns (uint256 precioNft) {
        return preciosNFT[_nftId];
    }    

    function nftMinteados (uint8 _cajaID) external view returns (uint256 nftMint) {
        return cajas[_cajaID].nftMinteados;
    }

    function nftNoMinteados (uint8 _cajaID) external cajasValidas(_cajaID) view returns (uint256 nftNoMint) {
        return cajas[_cajaID].nftNoMinteados;
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

    mapping (address => mapping (uint8 => uint256)) private listaDeFarming;
    uint256[4] private gananciasPorSegundoMicroondas; 

    uint256 private configuracionTiempoDeFarming ; 
    
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

    modifier cajasValidas(uint8 cajaId) {
        require(cajaId > 0 && cajaId < 4 , "La caja no existe");
        _;
    }

    function cambiarGananciasAlSegundo(uint256[] memory gananciasAlSegundo) public onlyOwner {
        _cambiarGananciasAlSegundo(gananciasAlSegundo); 
    }

    function _cambiarGananciasAlSegundo(uint256[] memory gananciasAlSegundo) internal {
        gananciasPorSegundoMicroondas[1] = gananciasAlSegundo[0]; 
        gananciasPorSegundoMicroondas[2] = gananciasAlSegundo[1]; 
        gananciasPorSegundoMicroondas[3] = gananciasAlSegundo[2];  
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
	
    function farming(address addressFarming, uint8 cajaId) external cajasValidas(cajaId) onlyUser {
        uint256 tokensAReclamar = recompensaAcumulada(addressFarming,cajaId);
        if(tokensAReclamar > 0) {
            _mint(addressFarming, tokensAReclamar);
            emit ReclamoRecompensa(addressFarming,cajaId,tokensAReclamar);
        }
        listaDeFarming[addressFarming][cajaId] = block.timestamp;
        emit FarmingActivo(addressFarming,cajaId);
    }

	function reclamarRecompensa(uint8 cajaId) public cajasValidas(cajaId)  {
        require(superadoTiempoDeFarming(msg.sender,cajaId), "No superado el tiempo para reclamar");
        uint256 tokensAReclamar = recompensaAcumulada(msg.sender,cajaId);
        listaDeFarming[msg.sender][cajaId] = block.timestamp;     
        _mint(msg.sender, tokensAReclamar);

        emit ReclamoRecompensa(msg.sender,cajaId,tokensAReclamar); 
    }
	
    function tiempoDeFarming() view public returns(uint256){
        return configuracionTiempoDeFarming;
    }

    function superadoTiempoDeFarming(address addressFarming,uint8 cajaId) view public cajasValidas(cajaId) returns(bool){
        return tiempoDeFarming(addressFarming,cajaId) > configuracionTiempoDeFarming;
    }

    function recompensaAcumulada(address addressFarming,uint8 cajaId) view public cajasValidas(cajaId) returns(uint256 recompensa){
        return tiempoDeFarming(addressFarming,cajaId) * gananciasPorSegundoMicroondas[cajaId];
    }

    function tiempoDeFarmingTotal(address addressFarming,uint8 cajaId) view external cajasValidas(cajaId) returns(uint256){
        return tiempoDeFarming(addressFarming,cajaId);
    }

    function tiempoDeFarming(address addressFarming, uint8 cajaId)  view internal returns(uint256 farmado) {
        return listaDeFarming[addressFarming][cajaId] > 0 ? 
        block.timestamp - listaDeFarming[addressFarming][cajaId] : 0;        
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