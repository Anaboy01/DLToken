import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Todo Test", function () {


    

    async function deployDLTokenFixture(){

      
        const signers = await hre.ethers.getSigners();

        const Token = await hre.ethers.getContractFactory("DLToken");
        const token = await Token.deploy("DLTOken", "DLT");

        
        const owner = signers[0]
        const otherAccount = signers[1]
        const otherAccount1 = signers[2]
        const otherAccount2 = signers[3]
        const otherAccount3 = signers[4]

        return {token, owner, otherAccount, otherAccount1, otherAccount2, otherAccount3}
    }

    describe("deployment", () => {
        it("should tell if it deployed", async function () {
            const {token, owner} = await loadFixture(deployDLTokenFixture)

            expect(await token.owner()).to.equal(owner);
        })
    })

    it("should get token name", async function () {
        const {token, owner} = await loadFixture(deployDLTokenFixture)

        const name = await token.connect(owner).getTokenName()

        expect(name).to.be.equal(await token.tokenName());

    })

    it("should get token symbol", async function () {
        const {token, owner} = await loadFixture(deployDLTokenFixture)

        

        const symbol = await token.connect(owner).getSymbol()

        expect(symbol).to.be.equal(await token.tokenSymbol());

    })

    it("should get token total supply", async function () {
        const {token, owner} = await loadFixture(deployDLTokenFixture)

        

        const supply = await token.connect(owner).getTotalSupply()

        expect(supply).to.be.equal(await token.totalSupply());

    })

    it("should check if the token is in wei", async function () {
        const {token, owner} = await loadFixture(deployDLTokenFixture)

        

        const decimals = await token.connect(owner).decimal()

        expect(decimals).to.be.equal(18);

    })

    it("should check the balance of a acct", async function () {
        const {token, owner} = await loadFixture(deployDLTokenFixture)

        

        const balance = await token.connect(owner).balanceOf(owner.address)



        expect(balance).to.be.equal(await token.balanceOf(owner.address));

    })

    describe("Main Functions", () => {
        it("should transfer token to an acct", async function () {
            const {token, owner, otherAccount} = await loadFixture(deployDLTokenFixture)
    
            const intialBalance = await token.connect(owner).balanceOf(otherAccount.address)
    
            await token.connect(owner).transfer(otherAccount.address, 1000)
    
    
    
            expect(await token.balanceOf(otherAccount.address)).to.be.greaterThan(intialBalance);
    
        })

        it("should approve a delegate spender", async function () {
            const {token, owner, otherAccount} = await loadFixture(deployDLTokenFixture)

            const tokenAmount = 1000
    
           await token.connect(owner).approve(otherAccount.address, tokenAmount)
    
    
            expect(await token.allowance(owner.address, otherAccount.address)).to.be.equal(tokenAmount);
    
        });

        it("should check the allowed tokens to a delegate spender", async function () {
            const {token, owner, otherAccount} = await loadFixture(deployDLTokenFixture)

            const tokenAmount = 1000
    
           await token.connect(owner).approve(otherAccount.address, tokenAmount)

           const allow = await token.allowance(owner.address, otherAccount.address)
    
            expect(allow).to.be.equal(tokenAmount);
    
        })

        it("delegates should transfer token on behalf of owner", async function () {
            const {token, owner, otherAccount, otherAccount2} = await loadFixture(deployDLTokenFixture)

            const tokenAmount = 1000

            const intialBalance = await token.balanceOf(otherAccount2.address)
    
            await token.connect(owner).approve(otherAccount.address, tokenAmount)

            await token.allowance(owner.address, otherAccount.address)

            await token.connect(otherAccount).transferFrom(owner.address, otherAccount2.address, 500)

            const currentBalance = await token.balanceOf(otherAccount2.address)
    
            expect(intialBalance).to.be.lessThan(currentBalance);
    
        })

        it("should burn token", async function () {
            const {token, owner, otherAccount} = await loadFixture(deployDLTokenFixture)

    

            const intialTotalSupply = await token.getTotalSupply()


            await token.connect(owner).transfer(otherAccount, 1000)

            const currentTotalSupply = await await token.getTotalSupply()
    
            expect(intialTotalSupply).to.be.greaterThan(currentTotalSupply);
    
        })

        it("checking for minted token", async function () {
            const {token, owner, otherAccount} = await loadFixture(deployDLTokenFixture)


            const currentTotalSupply = await token.getTotalSupply()
    
            expect(currentTotalSupply).to.be.greaterThan(0);
    
        })


    })

    describe("Logs check",() => {
        it("should log token transfered", async function () {
            const {token, owner, otherAccount} = await loadFixture(deployDLTokenFixture)
    
            expect(  await token.connect(owner).transfer(otherAccount.address, 1000)).to.emit(token, "Transfer").withArgs(owner,otherAccount, 1000 );
    
        })

        it("should log token approved", async function () {
            const {token, owner, otherAccount} = await loadFixture(deployDLTokenFixture)

            const tokenAmount = 1000
    
            
    
            expect(  await token.connect(owner).approve(otherAccount, tokenAmount)).to.emit(token, "Approval").withArgs(owner,otherAccount, 1000 );
    
        })
    })







})