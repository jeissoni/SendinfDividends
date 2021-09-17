
const assert = require('assert');
const hardhat = require("hardhat");
const {etherjs, BigNumber} = require('ethers');


let Token;
let contracDeployed;
let tressDeployed;
let owner;
let addr1;
let addr2;

let name = "tress";
let symbol = "trs"
let supply = ethers.utils.parseUnits("333333333",18);
const otro = BigNumber.from("333333333").pow(18);

console.log(supply.toString());
console.log(otro.toString());


beforeEach(async function(){

    sendingDividends = await ethers.getContractFactory("SendingDividends");
    tres = await ethers.getContractFactory("XVORTEX");;


    [owner, addr1, addr2] = await ethers.getSigners();

    contracDeployed = await sendingDividends.deploy();   
    tressDeployed = await tres.deploy(name,symbol,supply.toString());
});


describe ("Deployment Sending Dividends", function(){
    it("Should set the right owner", async function(){
        assert.equal(await contracDeployed.owner(), owner.address, "The address is not the owner");
    });


});



describe ("Smart Contract TRESS", function(){
    it("Direction is Pausable", async function(){
        assert.equal(await tressDeployed.isPauser(owner.address), true, "Direction is not pausable")
    });

    
    it("Total Supplay is correct", async function(){
        assert.equal(await tressDeployed.totalSupply(), supply.toString(), "Fail Total supplay")
    });


    it("Supply belongs to the account you display", async function(){
        assert.equal(await tressDeployed.balanceOf(owner.address), supply.toString(), "Account that displays does not have all the supply")
    });

    it("Sending token", async() => {
        let sending = ethers.utils.parseUnits("1000",18);


        await tressDeployed.transfer(addr1.address, sending.toString(), {from : owner.address});
        assert.equal(await tressDeployed.balanceOf(addr1.address), sending, "Failed to receive tokens");
        assert.equal(await tressDeployed.balanceOf(owner.address), supply - sending, "Failed to sending tokens");
    });


});





