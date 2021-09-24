
const assert = require('assert');
const hardhat = require("hardhat");
const {etherjs, BigNumber, utils} = require('ethers');


let prov ;
let contracDeployed;
let tressDeployed;
// let owner;
// let addr1;
// let addr2;

let owner
let addr1
let addr2
//let addr3
//let addr4

let name = "tress";
let symbol = "trs";
let totalSupply = 333333333;


const supply = BigNumber.from("10").pow(18).mul(totalSupply);


beforeEach(async function(){

    sendingDividends = await ethers.getContractFactory("SendingDividends");
    tres = await ethers.getContractFactory("XVORTEX");


    [addr0, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    contracDeployed = await sendingDividends.deploy();   
    tressDeployed = await tres.deploy(name,symbol,supply.toString());

    prov = ethers.getDefaultProvider();
});






describe("Deployment Sending Dividends", function () {

    
    it("disperseEther function", async()=>{
        
        //let mire = await prov.getBalance(addr0.ge)
        //console.log((await addr0.getBalance()).toString());
        //let sending = BigNumber.from('10').pow(18).mul(1);
        let sending = utils.parseEther("1.0");
        let recipients = [addr1.address.toString(), addr2.address.toString()];
        let values = [sending, sending];
        await contracDeployed.disperseEther(
            recipients,
            values,
            {from : addr0.address}            
        );

    })

    it("disperseTokenSimple funtion", async () => {      

        let sending = BigNumber.from('10').pow(18).mul(1000);
        let recipients = [addr1.address.toString(), addr2.address.toString()];
        let values = [sending, sending];
        await tressDeployed.approve(contracDeployed.address, sending.mul(2));

        await contracDeployed.disperseTokenSimple(
            tressDeployed.address.toString(),
            recipients,
            values, {
                from: addr0.address
            }
        );
        
        assert.equal(await tressDeployed.balanceOf(addr1.address),sending.toString(),"adrres1 fallo")   
        assert.equal(await tressDeployed.balanceOf(addr2.address),sending.toString(),"adrres2 fallo")
    });

    it("disperseToken function", async()=>{
        let sending = BigNumber.from('10').pow(18).mul(1000);
        let recipients = [addr1.address.toString(), addr2.address.toString()];
        let values = [sending, sending];


        await tressDeployed.approve(contracDeployed.address, sending.mul(2));

        await contracDeployed.disperseToken(
            tressDeployed.address.toString(),
            recipients,
            values,
            {from: addr0.address}
        );

        assert.equal(await tressDeployed.balanceOf(addr1.address),sending.toString(),"adrres1 fallo")   
        assert.equal(await tressDeployed.balanceOf(addr2.address),sending.toString(),"adrres2 fallo")
    });

});



describe ("Smart Contract TRESS", function(){
    it("Direction is Pausable", async function(){
        assert.equal(await tressDeployed.isPauser(addr0.address), true, "Direction is not pausable")
    });

    
    it("Total Supplay is correct", async function(){
        assert.equal(await tressDeployed.totalSupply(), supply.toString(), "Fail Total supplay")
    });


    it("Supply belongs to the account you display", async function(){
        assert.equal(await tressDeployed.balanceOf(addr0.address), supply.toString(), "Account that displays does not have all the supply")
    });

    it("Sending token", async() => {
        let sending = BigNumber.from('10').pow(18).mul(1000);
        await tressDeployed.transfer(addr1.address, sending.toString(), {from : addr0.address});
        assert.equal(await tressDeployed.balanceOf(addr1.address), sending.toString(), "Failed to receive tokens");
        assert.equal(await tressDeployed.balanceOf(addr0.address), supply.sub(sending).toString(), "Failed to sending tokens");
    });

});





