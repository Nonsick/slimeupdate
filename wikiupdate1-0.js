// var nodegit = require("nodegit");
// const { ConsoleMessage } = require('puppeteer');

const bent = require('bent');
const jsdom = require("jsdom");
var path = require('path');
const fs = require('fs')
const $ = require("jquery")
const { exec } = require("child_process");
const execSync = require('child_process').execSync;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
  // No-op to skip console errors.
});
let owner = "Seikirin"
let repo = "slimeimwiki"
let jsonpath = "data/events.json"

let commitnumber = 0
let commits = []

async function GetPageData(url) {
    const getStream = bent(url)
    let stream = await getStream()
    stream.status
    stream.statusCode
    const str = await stream.text()
    const dom = new jsdom.JSDOM(str, {virtualConsole});
    return dom
}

const types = {
    Fire: "https://i.imgur.com/QndVudD.png",
    Wind: "https://i.imgur.com/pQYVkI3.png",
    Space: "https://i.imgur.com/z8bnSYg.png",
    Light: "https://i.imgur.com/hX15sR0.png",
    Dark: "https://i.imgur.com/pzX6NRL.png",
    Earth: "https://i.imgur.com/AHPti72.png",
    Water: "https://i.imgur.com/NchScWh.png",
    Melee: "https://i.imgur.com/EWYVugy.png",
    Magic: "https://i.imgur.com/SsC1hEj.png"
}

let typeconvert = {
    physics: types["Melee"],
    magic: types["Magic"],
    holy: types["Light"],
    dark: types["Dark"],
    wind: types["Wind"],
    fire: types["Fire"],
    air: types["Space"],
    water: types["Water"],
    earth: types["Earth"]
}

let Icons = {
    Notice: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icon_info.png",
    Event: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icon_event.png",
    Recruit: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icon_scout.png",
    Campaign: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icon_campaign.png",
    Issues: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icon_bug.png",
    Update: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icon_update.png",
    Maintenance: "https://ten-sura-m-assets-us.akamaized.net/web-assets/images/announcement/icon_maintenance.png"
}

const atktype = {
    Melee: "https://i.imgur.com/P8lUDX0.png",
    Magic: "https://i.imgur.com/tOS4FvO.png"
}

let atktypeconvert = {
    physics: atktype["Melee"],
    magic: atktype["Magic"]
}


async function RIPLF() {
    let CharacterData = []

    let dom2 = await GetPageData('https://appmedia.jp/utaware-lostflag/4664383')
    let document = dom2.window.document
    let Tables = document.querySelectorAll(".post-content > table")

    let id = 0
    let INLIST = 0
    let LOADED = 0
    let promises = []
    let LINKSADDED = `//////////////////////////////////////////////////////
`
    for await (const ele of Tables) {
        if (id > 0 && id < 4) {
            let entry = ele.querySelector(":scope > tbody")
            let Tables2 = entry.querySelectorAll(":scope > tr")
            let id2 = 0
            for await (const ele of Tables2) {
                if (id2 > 0) {
                    let Icon = ele.querySelector(":scope > td > a > img").src
                    let Link = ele.querySelector(":scope > td > a").href
                    INLIST++;
                    promises.push(new Promise(async function (resolve, reject) {
                        LINKSADDED += Link + `
`
                        let dom = await GetPageData(Link)
                        LOADED++;
                        LINKSADDED = LINKSADDED.replaceAll(Link+`
`, "")
                        console.log(LINKSADDED)
                        let document = dom.window.document

                        while (!(document.querySelectorAll(".post-content > table > tbody")[0].querySelector('tr > td.utaware_tdth'))) {
                            document.querySelector('table').replaceWith();
                            console.log("removed")
                        }
                        console.log("NOW PARSING " + Link)
                        CharacterData.push({
                            Icon: Icon,
                            Name: document.querySelectorAll(".post-content > table > tbody")[0].querySelectorAll("tr > td")[1].textContent,
                            Rarity: document.querySelectorAll(".post-content > table > tbody")[0].querySelectorAll("tr > td > span")[0].textContent.length,
                            Element: document.querySelectorAll(".post-content > table > tbody")[0].querySelectorAll("tr > td")[5].textContent,
                            Position: document.querySelectorAll(".post-content > table > tbody")[0].querySelectorAll("tr > td")[7].textContent,
                            VA: document.querySelectorAll(".post-content > table > tbody")[0].querySelectorAll("tr > td")[9].textContent,
                            Get: document.querySelectorAll(".post-content > table > tbody")[0].querySelectorAll("tr > td")[11].textContent,
                            Strength: Number(document.querySelectorAll(".post-content > table > tbody")[1].querySelectorAll("tr > td")[1].textContent.replaceAll(",", "")),
                            Health: Number(document.querySelectorAll(".post-content > table > tbody")[1].querySelectorAll("tr > td")[3].textContent.replaceAll(",", "")),
                            Attack: Number(document.querySelectorAll(".post-content > table > tbody")[1].querySelectorAll("tr > td")[5].textContent.replaceAll(",", "")),
                            NormalImage: document.querySelectorAll(".post-content > table > tbody")[3].querySelectorAll("tr > td")[4].querySelector("img").src,
    
                            NormalSpeed: document.querySelectorAll(".post-content > table > tbody")[3].querySelectorAll("tr > td")[5].textContent,
                            NormalTimes: document.querySelectorAll(".post-content > table > tbody")[3].querySelectorAll("tr > td")[6].textContent,
                            NormalDesc: document.querySelectorAll(".post-content > table > tbody")[3].querySelectorAll("tr > td")[7].textContent,
    
                            C1Image: document.querySelectorAll(".post-content > table > tbody")[4].querySelectorAll("tr > td")[4].querySelector("img").src,
                            C1Cost: document.querySelectorAll(".post-content > table > tbody")[4].querySelectorAll("tr > td")[6].textContent,
                            C1Cooldown: document.querySelectorAll(".post-content > table > tbody")[4].querySelectorAll("tr > td")[8].textContent,
                            C1Description: document.querySelectorAll(".post-content > table > tbody")[4].querySelectorAll("tr > td")[9].textContent,
    
                            C2Image: document.querySelectorAll(".post-content > table > tbody")[4].querySelectorAll("tr > td")[4 + 7].querySelector("img").src,
                            C2Cost: document.querySelectorAll(".post-content > table > tbody")[4].querySelectorAll("tr > td")[6 + 7].textContent,
                            C2Cooldown: document.querySelectorAll(".post-content > table > tbody")[4].querySelectorAll("tr > td")[8 + 7].textContent,
                            C2Description: document.querySelectorAll(".post-content > table > tbody")[4].querySelectorAll("tr > td")[9 + 7].textContent,
    
                            C3Image: document.querySelectorAll(".post-content > table > tbody")[4].querySelectorAll("tr > td")[4 + 14].querySelector("img").src,
                            C3Cost: document.querySelectorAll(".post-content > table > tbody")[4].querySelectorAll("tr > td")[6 + 14].textContent,
                            C3Cooldown: document.querySelectorAll(".post-content > table > tbody")[4].querySelectorAll("tr > td")[8 + 14].textContent,
                            C3Description: document.querySelectorAll(".post-content > table > tbody")[4].querySelectorAll("tr > td")[9 + 14].textContent,
    
                            Passive1: document.querySelectorAll(".post-content > table > tbody")[5].querySelectorAll("tr > td")[0].textContent,
                            Passive2: document.querySelectorAll(".post-content > table > tbody")[5].querySelectorAll("tr > td")[1].textContent,
                            AppMedia: Link
    
                        })
                        resolve()
                    }))
                }
                id2++;
            }
        }
        id++;
    }

    await Promise.all(promises)

    fs.writeFile("output.json", JSON.stringify(CharacterData), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }

        console.log("JSON file has been saved.");
    })
}

async function UpdateCharacters() {
    let ther = await octokit.request('GET /repos/Seikirin/slimeimwiki/contents/data.json', {
        owner: owner,
        repo: repo,
        path: jsonpath
    })
    let CharacterData = JSON.parse(Buffer.from(ther.data.content, 'base64').toString('utf8'))
    const data_sha = ther.data.sha
    let dom2 = await GetPageData('https://api-us.ten-sura-m.wfs.games/web/announcement/500000070?region=1&language=2&phoneType=1')
    if (dom2.window.document.querySelector(".chara-grid")) {
        dom2.window.document.querySelectorAll(".chara-grid").forEach(async function (ele) {
            let CharName = ele.previousElementSibling.querySelector(".headline-m-text").innerHTML
            CharName = CharName.split("] ")[1] + " " + CharName.split("] ")[0] + "]"
            let found = false
            let FirstName = CharName.split(" ")[0]
            let amount = 1
            console.log(CharName)
            Object.keys(CharacterData).forEach(async function (key) {
                if (CharacterData[key].Name == CharName) {
                    found = key
                    FirstName = key
                }
            })
            if (found == false) {
                while ((FirstName + amount.toString()) in CharacterData) {
                    amount = amount + 1
                }
                FirstName = FirstName + amount.toString()
            }
            let SecretType
            let Secret
            let DivineProtection
            let SupportDivineProtection
            let ProtectionSkill
            let Skill1
            let Skill1Icon
            let Skill2
            let Skill2Icon
            let Trait1
            let Trait1A
            let ProtectionSkillIcon
            let EXAbility1
            let EXAbility1Icon
            let EXAbility2
            let EXAbility2Icon
            let Type
            let SecondType
            let AtkType
            let UnitType = "Battle Characters"
            if (ele.querySelectorAll(".chara-skills-secret")[0]) {
                Skill1Icon = ele.querySelectorAll(".chara-skills-icon > img")[0].getAttribute("src")
                Skill2Icon = ele.querySelectorAll(".chara-skills-icon > img")[1].getAttribute("src")
                EXAbility1 = ele.querySelectorAll(".chara-skills-text")[6].previousElementSibling.textContent + ":" + ele.querySelectorAll(".chara-skills-text")[6].textContent
                EXAbility2 = ele.querySelectorAll(".chara-skills-text")[7].previousElementSibling.textContent + ":" + ele.querySelectorAll(".chara-skills-text")[7].textContent
                EXAbility1Icon = ele.querySelectorAll(".chara-skills-icon > img")[2].getAttribute("src")
                EXAbility2Icon = ele.querySelectorAll(".chara-skills-icon > img")[3].getAttribute("src")
            }
            else {
                UnitType = "Protection Characters"
                if (ele.querySelectorAll(".chara-skills-name")[2]) {
                    SupportDivineProtection = ele.querySelectorAll(".chara-skills-name")[0].textContent + ":" + ele.querySelectorAll(".chara-skills-text")[2].textContent
                }
                ProtectionSkillIcon = ele.querySelectorAll(".chara-skills-icon > img")[1].getAttribute("src")
            }
            if (found != false) {
                CharacterData[FirstName].SupportDivineProtection = SupportDivineProtection
                CharacterData[FirstName].Skill1Icon = Skill1Icon
                CharacterData[FirstName].Skill2Icon = Skill2Icon
                CharacterData[FirstName].ProtectionSkillIcon = ProtectionSkillIcon
                CharacterData[FirstName].EXAbility1 = EXAbility1
                CharacterData[FirstName].EXAbility1Icon = EXAbility1Icon
                CharacterData[FirstName].EXAbility2 = EXAbility2
                CharacterData[FirstName].EXAbility2Icon = EXAbility2Icon
                CharacterData[FirstName].UnitType = UnitType
                CharacterData[FirstName].Octagram = true
            } else {
                console.log(CharName + " NOT FOUND")
            }
        })
    }
    await new Promise(r => setTimeout(r, 5000));

    jsonpath = "data.json"

    content = Buffer.from(JSON.stringify(CharacterData), 'utf8').toString('base64');
    console.log("published")
    fileContent = await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        sha: data_sha,
        message: 'auto update event',
        content,
    });
    const { commit: { html_url2 } } = fileContent.data;
}

// function Clean(string)
// {
//     return string.replaceAll("（", "(").replaceAll("", "")
// }

async function ha() {
    const { Octokit } = require("octokit");
    const ISOSTRING = "<lastmod>" + (new Date().toISOString()) + "</lastmod>";
    const octokit = new Octokit({
        auth: process.env.SECRET_CODE
    })
    path = jsonpath

    let bro = await octokit.request('GET /repos/Seikirin/slimeimwiki/contents/data/events.json', {
        owner: owner,
        repo: repo,
        path: path
    })
    let ther = await octokit.request('GET /repos/Seikirin/slimeimwiki/contents/data/data.json', {
        owner: owner,
        repo: repo,
        path: path
    })
    let dude = await octokit.request('GET /repos/Seikirin/slimeimwiki/contents/sitemap.xml', {
        owner: owner,
        repo: repo,
        path: path
    })

    let Today = new Date()


    let EventData = JSON.parse(Buffer.from(bro.data.content, 'base64').toString('utf8'))
    let CharacterData = JSON.parse(Buffer.from(ther.data.content, 'base64').toString('utf8'))
    let SiteMap = Buffer.from(dude.data.content, 'base64').toString('utf8')
    const file_sha = bro.data.sha
    const data_sha = ther.data.sha
    const map_sha = dude.data.sha

    Object.keys(EventData).forEach(function (key) {
        EventData[key].Current = false
        EventData[key].New = false
    })

    let dom = await GetPageData('https://api-us.ten-sura-m.wfs.games/web/announcement?region=1&language=2&phoneType=1')

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    async function TreatEvent(ele, type) {
        if (type == 2 && !(ele.querySelector("a > div > .is-new"))) {
            return;
        }
        let EventName
        if (type == 1)
            EventName = ele.querySelector("a > img").getAttribute("alt")
        else
            EventName = ele.querySelector("a > p").textContent
        let Link = "https://api-us.ten-sura-m.wfs.games" + ele.querySelector("a").getAttribute("href")
        let EventImage
        let EventType
        if (type == 1) {
            EventImage = ele.querySelector("a > img").getAttribute("src")
            console.log(EventImage)
        }
        else {
            EventImage = Icons[ele.querySelector("a > div > h2").textContent.trim()]
            EventType = ele.querySelector("a > div > h2").textContent.trim()
            console.log(EventImage)
        }
        let Start
        let End = Start
        let Banner = [];
        if (type == 1) {
            let EventDate = ele.querySelector(".event-date").innerHTML
            if (EventDate) {
                Start = EventDate.split("~")[0]
                End = EventDate.split("~")[1]
                //Start = Start.split("(")[0] + "/" + Today.getFullYear()
                Start = Start.split("/")[0].split("").reverse().join("").split(" ")[0].split("(")[0].split("").reverse().join("") + "/" + Start.split("/")[1].split(" ")[0].split("(")[0] + "/" + Today.getFullYear()
                if (End.includes("/"))
                    End = End.split("/")[0].split("").reverse().join("").split(" ")[0].split("(")[0].split("").reverse().join("") + "/" + End.split("/")[1].split(" ")[0].split("(")[0] + "/" + Today.getFullYear()
                else
                    End = Start
                console.log(Start + " - " + End)
            }
        }
        else {
            let EventDate = ele.querySelector("a > div > p")
            if (EventDate) {
                Start = EventDate.textContent.split("~")[0]
                Start = Start.split("/")[0].split("").reverse().join("").split(" ")[0].split("(")[0].split("").reverse().join("") + "/" + Start.split("/")[1].split(" ")[0].split("(")[0] + "/" + Today.getFullYear()
                End = Start
            }
        }
        let dom2 = await GetPageData(Link)
        if (dom2.window.document.querySelector(".chara-grid")) {
            let allgrids = dom2.window.document.querySelectorAll(".chara-grid")
            for await (const ele of allgrids) {
                let CharName = ele.previousElementSibling.querySelector(".headline-m-text").innerHTML
                CharName = CharName.split("] ")[1] + " " + CharName.split("] ")[0] + "]"
                let found = false
                let FirstName = CharName.split(" ")[0]
                let amount = 1
                console.log(CharName)
                Object.keys(CharacterData).forEach(async function (key) {
                    if (CharacterData[key].Name == CharName) {
                        found = key
                        FirstName = key
                    }
                })
                if (found == false) {
                    while ((FirstName + amount.toString()) in CharacterData) {
                        amount = amount + 1
                    }
                    FirstName = FirstName + amount.toString()
                }
                Banner.push(FirstName)
                let SecretType
                let Secret
                let DivineProtection
                let SupportDivineProtection
                let ProtectionSkill
                let Skill1
                let Skill1Icon
                let Skill2
                let Skill2Icon
                let Trait1
                let Trait1A
                let Valor1
                let Valor1A
                let ProtectionSkillIcon
                let EXAbility1
                let EXAbility1Icon
                let EXAbility2
                let EXAbility2Icon
                let SecretSkillTrait
                let Type
                let SecondType
                let AtkType
                let UnitType = "Battle Characters"
                if (ele.querySelectorAll(".chara-skills-secret")[0]) {
                    //SecretType = capitalizeFirstLetter(ele.querySelectorAll(".chara-skills-secret")[0].getAttribute("data-secret-badge"))
                    let Container =  Array.from(ele.querySelectorAll(".chara-skills-container"))
                    let TraitsContainer =  Array.from(ele.querySelectorAll("section"))

                    let SecretSection = Container.find(el => el.textContent.includes('Secret Skill'))
                    let SkillsSection = Container.find(el => el.textContent.includes('Battle Skills'))
                    let ValorSection = TraitsContainer.find(el => el.textContent.includes('Valor Traits'))
                    let TraitsSection = TraitsContainer.find(el => el.textContent.includes('Character Traits'))
                    let SecretSkillTraitSection = TraitsContainer.find(el => el.textContent.includes('Secret Skill Enhancement Traits'))
                    let EXSection = TraitsContainer.find(el => el.textContent.includes('EX Ability Release'))

                    Secret = SecretSection.querySelector(".chara-skills-name").textContent + ":" + SecretSection.querySelector(".chara-skills-text").textContent
                    SecretType = Secret.toLowerCase().includes("all-target") ? "All" : "Single"
                    
                    for (let i = 0; i <= 1; i++) {
                        let SkillTitle = SkillsSection.querySelectorAll(".chara-skills-name")[i]
                        let SkillText = SkillsSection.querySelectorAll(".chara-skills-text")[i]
                        if (i == 0)
                        {
                            Skill1 = SkillTitle.textContent + "/Lv.10:" + SkillText.textContent.replace(SkillText.innerHTML.split("<br>")[0], "") + "Cost: " + SkillText.innerHTML.split("<br>")[0].replace("Points Required: ", "")
                            Skill1Icon = SkillsSection.querySelectorAll(".chara-skills-icon > img")[i].src
                        }
                        else
                        {
                            Skill2 = SkillTitle.textContent + "/Lv.10:" + SkillText.textContent.replace(SkillText.innerHTML.split("<br>")[0], "") + "Cost: " + SkillText.innerHTML.split("<br>")[0].replace("Points Required: ", "")
                            Skill2Icon = SkillsSection.querySelectorAll(".chara-skills-icon > img")[i].src
                        }
                    }
                    
                    if (ValorSection)
                    {
                        Valor1 = ValorSection.querySelectorAll(".header")[0].textContent + ":" + ValorSection.querySelectorAll("p")[0].textContent
                        if (ValorSection.querySelectorAll(".header")[1])
                            Valor1A = ValorSection.querySelectorAll(".header")[1].textContent + ":" + ValorSection.querySelectorAll("p")[1].textContent
                    }

                    if (TraitsSection)
                    {
                        Trait1 = TraitsSection.querySelectorAll(".header")[0].textContent + ":" + TraitsSection.querySelectorAll("p")[0].textContent
                        Trait1A = TraitsSection.querySelectorAll(".header")[1].textContent + ":" + TraitsSection.querySelectorAll("p")[1].textContent
                    }

                    if (SecretSkillTraitSection)
                    {
                        SecretSkillTrait = SecretSkillTraitSection.querySelectorAll(".header")[0].textContent + ":" + SecretSkillTraitSection.querySelectorAll("p")[0].textContent
                    }

                    for (let i = 0; i <= 1; i++) {
                        let SkillTitle = SkillsSection.querySelectorAll(".chara-skills-name")[i]
                        let SkillText = SkillsSection.querySelectorAll(".chara-skills-text")[i]
                        if (i == 0)
                        {
                            Skill1 = SkillTitle.textContent + "/Lv.10:" + SkillText.textContent.replace(SkillText.innerHTML.split("<br>")[0], "") + "Cost: " + SkillText.innerHTML.split("<br>")[0].replace("Points Required: ", "")
                            Skill1Icon = SkillsSection.querySelectorAll(".chara-skills-icon > img")[i].src
                        }
                        else
                        {
                            Skill2 = SkillTitle.textContent + "/Lv.10:" + SkillText.textContent.replace(SkillText.innerHTML.split("<br>")[0], "") + "Cost: " + SkillText.innerHTML.split("<br>")[0].replace("Points Required: ", "")
                            Skill2Icon = SkillsSection.querySelectorAll(".chara-skills-icon > img")[i].src
                        }
                    }
                    
                    EXAbility1 = EXSection.querySelectorAll(".chara-skills-name")[0].textContent + ":" + EXSection.querySelectorAll(".chara-skills-text")[0].textContent
                    EXAbility2 = EXSection.querySelectorAll(".chara-skills-name")[1].textContent + ":" + EXSection.querySelectorAll(".chara-skills-text")[1].textContent
                    EXAbility1Icon = EXSection.querySelectorAll(".chara-skills-icon > img")[0].src
                    EXAbility2Icon = EXSection.querySelectorAll(".chara-skills-icon > img")[1].src
    
                    Type = typeconvert[ele.previousElementSibling.getAttribute("data-attribute")]
                    AtkType = atktypeconvert[ele.previousElementSibling.getAttribute("data-type")]
                }
                else {
                    UnitType = "Protection Characters"
                    DivineProtection = ele.querySelectorAll(".chara-skills-name")[0].textContent + ":" + ele.querySelectorAll(".chara-skills-text")[1].textContent
                    if (ele.querySelectorAll(".chara-skills-name")[2]) {
                        SupportDivineProtection = ele.querySelectorAll(".chara-skills-name")[0].textContent + ":" + ele.querySelectorAll(".chara-skills-text")[2].textContent
                        ProtectionSkill = ele.querySelectorAll(".chara-skills-name")[2].textContent + "/Lv.10:" + ele.querySelectorAll(".chara-skills-text")[3].textContent
                        Trait1 = ele.querySelectorAll(".chara-skills-text")[4].previousElementSibling.textContent + ":" + ele.querySelectorAll(".chara-skills-text")[4].textContent
                        Trait1A = ele.querySelectorAll(".chara-skills-text")[5].previousElementSibling.textContent + ":" + ele.querySelectorAll(".chara-skills-text")[5].textContent
                    }
                    else {
                        ProtectionSkill = ele.querySelectorAll(".chara-skills-name")[1].textContent + "/Lv.10:" + ele.querySelectorAll(".chara-skills-text")[2].textContent
                        Trait1 = ele.querySelectorAll(".chara-skills-text")[3].previousElementSibling.textContent + ":" + ele.querySelectorAll(".chara-skills-text")[3].textContent
                        Trait1A = ele.querySelectorAll(".chara-skills-text")[4].previousElementSibling.textContent + ":" + ele.querySelectorAll(".chara-skills-text")[4].textContent
                    }
                    ProtectionSkillIcon = ele.querySelectorAll(".chara-skills-icon > img")[1].getAttribute("src")
                    Type = typeconvert[ele.previousElementSibling.getAttribute("data-leader")]
                    SecondType = typeconvert[ele.previousElementSibling.getAttribute("data-leader-2")]

                }
                if (found != false) {
                    CharacterData[FirstName].SupportDivineProtection = SupportDivineProtection
                    CharacterData[FirstName].Skill1Icon = Skill1Icon
                    CharacterData[FirstName].Skill2Icon = Skill2Icon
                    CharacterData[FirstName].ProtectionSkillIcon = ProtectionSkillIcon
                    CharacterData[FirstName].EXAbility1 = EXAbility1
                    CharacterData[FirstName].EXAbility1Icon = EXAbility1Icon
                    CharacterData[FirstName].EXAbility2 = EXAbility2
                    CharacterData[FirstName].EXAbility2Icon = EXAbility2Icon
                    CharacterData[FirstName].UnitType = UnitType
                    CharacterData[FirstName].Trait1 = Trait1
                    CharacterData[FirstName].Trait1A = Trait1A
                    CharacterData[FirstName].Valor1 = Valor1
                    CharacterData[FirstName].Valor1A = Valor1A
                    CharacterData[FirstName].SecretSkillTrait = SecretSkillTrait
                    CharacterData[FirstName].SecretType = SecretType
                    CharacterData[FirstName].MinHp = Number(ele.querySelectorAll(".chara-status-value")[0].textContent.split("(")[0])
                    CharacterData[FirstName].MaxHp = Number(ele.querySelectorAll(".chara-status-value")[0].textContent.split("(")[1].replaceAll(")", ""))
                    CharacterData[FirstName].MinAtk = Number(ele.querySelectorAll(".chara-status-value")[1].textContent.split("(")[0])
                    CharacterData[FirstName].MaxAtk = Number(ele.querySelectorAll(".chara-status-value")[1].textContent.split("(")[1].replaceAll(")", ""))
                    CharacterData[FirstName].MinDef = Number(ele.querySelectorAll(".chara-status-value")[2].textContent.split("(")[0])
                    CharacterData[FirstName].MaxDef = Number(ele.querySelectorAll(".chara-status-value")[2].textContent.split("(")[1].replaceAll(")", ""))
                    CharacterData[FirstName].MinOutput = Number(ele.querySelectorAll(".chara-status-value")[3].textContent.split("(")[0])
                    CharacterData[FirstName].MaxOutput = Number(ele.querySelectorAll(".chara-status-value")[3].textContent.split("(")[1].replaceAll(")", ""))
                    if (EventName.includes("Octagram Bazaar Character Details"))
                        CharacterData[FirstName].Octagram = true
                    else
                        CharacterData[FirstName].Octagram = false
                }
                else {
                    CharacterData = Object.assign({
                        [FirstName]: {
                            New: true,
                            Name: CharName,
                            Icon: (ele.querySelectorAll(".chara-skills-secret > img")[0] ?? ele.querySelectorAll(".chara-img > img")[0]).getAttribute("src"),
                            Art: ele.querySelectorAll(".chara-img > img")[0].getAttribute("src"),

                            UnitType: UnitType,
                            Type: Type,
                            SecondType: SecondType,
                            AtkType: AtkType,
                            Rarity: Number(ele.previousElementSibling.getAttribute("data-rarity")),
                            MinHp: Number(ele.querySelectorAll(".chara-status-value")[0].textContent.split("(")[0]),
                            MaxHp: Number(ele.querySelectorAll(".chara-status-value")[0].textContent.split("(")[1].replaceAll(")", "")),
                            MinAtk: Number(ele.querySelectorAll(".chara-status-value")[1].textContent.split("(")[0]),
                            MaxAtk: Number(ele.querySelectorAll(".chara-status-value")[1].textContent.split("(")[1].replaceAll(")", "")),
                            MinDef: Number(ele.querySelectorAll(".chara-status-value")[2].textContent.split("(")[0]),
                            MaxDef: Number(ele.querySelectorAll(".chara-status-value")[2].textContent.split("(")[1].replaceAll(")", "")),
                            MinOutput: Number(ele.querySelectorAll(".chara-status-value")[3].textContent.split("(")[0]),
                            MaxOutput: Number(ele.querySelectorAll(".chara-status-value")[3].textContent.split("(")[1].replaceAll(")", "")),
                            Town1: ele.querySelectorAll(".chara-skills-text")[0].innerHTML.split("<br>")[0],
                            Town2: ele.querySelectorAll(".chara-skills-text")[0].innerHTML.split("<br>")[1],

                            Valor1: Valor1,
                            Valor1A: Valor1A,

                            SecretSkillTrait: SecretSkillTrait,

                            SecretType: SecretType,
                            Secret: Secret,
                            Skill1: Skill1,
                            Skill1Icon: Skill1Icon,
                            Skill2: Skill2,
                            Skill2Icon: Skill2Icon,

                            DivineProtection: DivineProtection,
                            SupportDivineProtection: SupportDivineProtection,
                            ProtectionSkillIcon: ProtectionSkillIcon,
                            ProtectionSkill: ProtectionSkill,

                            Trait1: Trait1,
                            Trait1A: Trait1A,

                            EXAbility1: EXAbility1,
                            EXAbility2: EXAbility2,
                            EXAbility1Icon: EXAbility1Icon,
                            EXAbility2Icon: EXAbility2Icon,
                            Stats: [
                                2,
                                0,
                                0,
                                2,
                                8,
                                0,
                                2,
                                0,
                                0,
                                2,
                                0,
                                0
                            ]
                        }
                    }, CharacterData)
                }
            }
        }
        if (EventName in EventData) {
            New = EventData[EventName].New
            if (type == 2) {
                New = true
            }
            EventData[EventName] = {
                Image: EventImage,
                Start: Start ?? EventData[EventName].Start ?? ((Today.getMonth() + 1) + "/" + Today.getDate() + "/" + Today.getFullYear()),
                End: End ?? EventData[EventName].End ?? ((Today.getMonth() + 1) + "/" + Today.getDate() + "/" + Today.getFullYear()),
                Banner: EventData[EventName].Banner,
                Description: EventData[EventName].Description,
                Type: EventData[EventName].Type ?? EventType,
                Link: Link,
                Current: true,
                New: New,
            }
        } else
            EventData = Object.assign({
                [EventName]: {
                    Image: EventImage,
                    Start: Start ?? ((Today.getMonth() + 1) + "/" + Today.getDate() + "/" + Today.getFullYear()),
                    Banner: Banner,
                    End: End ?? ((Today.getMonth() + 1) + "/" + Today.getDate() + "/" + Today.getFullYear()),
                    Link: Link,
                    Type: EventType,
                    Current: true,
                    New: true,
                }
            }, EventData)
        console.log("DONE")
    }

    let getComputedStyle = dom.window.getComputedStyle
    let articles = dom.window.document.querySelectorAll('.article-group[data-switchtab-content="tab-0"] > .article-item')
    let events = dom.window.document.querySelectorAll(".banners > .event")
    let promises = []
    for await (const ele of articles) { promises.push(new Promise(async function (resolve, reject) { await TreatEvent(ele, 2); resolve() })) }
    await Promise.all(promises)
    promises = []
    for await (const ele of events) { promises.push(new Promise(async function (resolve, reject) { await TreatEvent(ele, 1); resolve() })) }
    await Promise.all(promises)
    console.log("allDONE")

    SiteMap = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<url><loc>https://old.slimeim.wiki/</loc>`+ ISOSTRING + `</url>
<url><loc>https://old.slimeim.wiki/characters/</loc>`+ ISOSTRING + `</url>
`
    Object.keys(CharacterData).forEach((key) => {
        SiteMap = SiteMap + `   <url>
        <loc>https://old.slimeim.wiki/characters/` + key + `/</loc>` + ISOSTRING + `
    </url>
`
    })
    SiteMap = SiteMap + `<url><loc>https://old.slimeim.wiki/events/</loc>` + ISOSTRING + `</url>
    <url><loc>https://old.slimeim.wiki/gacha/</loc>`+ ISOSTRING + `</url>
    <url><loc>https://old.slimeim.wiki/daily/</loc>`+ ISOSTRING + `</url>
    </urlset>`
    console.log(SiteMap)

    let content = Buffer.from(JSON.stringify(EventData), 'utf8').toString('base64');

    let fileContent = await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        sha: file_sha,
        message: 'auto update event',
        content,
    });

    const { commit: { html_url } } = fileContent.data;

    path = "data/data.json"

    content = Buffer.from(JSON.stringify(CharacterData), 'utf8').toString('base64');
    console.log("published")
    fileContent = await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        sha: data_sha,
        message: 'auto update event',
        content,
    });
    const { commit: { html_url2 } } = fileContent.data;


    path = "sitemap.xml"

    content = Buffer.from(SiteMap, 'utf8').toString('base64');
    fileContent = await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        sha: map_sha,
        message: 'auto update event',
        content,
    });
    const { commit: { html_url3 } } = fileContent.data;
    console.log("published")


}

async function test() {
    var url = "https://github.com/Seikirin/slimeimwiki",
        local = "./slimeimwiki",
        cloneOpts = {};

    const username = "Seikirin";
    const publickey = fs.readFileSync("C:\\Users\\these\\.ssh\\id_rsa.pub").toString();
    const privatekey = fs.readFileSync("C:\\Users\\these\\.ssh\\id_rsa").toString();
    console.log(publickey)
    console.log(privatekey)
    const passphrase = "";
    const cred = await nodegit.Cred.sshKeyMemoryNew(username, publickey, privatekey, passphrase);
    if (fs.existsSync("./slimeimwiki")) {
        fs.rmdirSync("./slimeimwiki", {recursive: true})
      }
    await nodegit.Clone(url, local, cloneOpts).then(async function (repo) {
        let characters = JSON.parse(fs.readFileSync(local + "/data/data.json"))
        const index = await repo.refreshIndex();


        for await (const key of Object.keys(characters)) {
            if (fs.existsSync(local + "/characters/" + key)) {
                fs.copyFileSync(local + "/index.html", local + "/characters/" + key + "/index.html")
            }
            else {
                fs.mkdirSync(local + "/characters/" + key)
                fs.copyFileSync(local + "/index.html", local + "/characters/" + key + "/index.html")
            }
            await index.addByPath("characters/" + key + "/index.html")
            console.log("indexed")
        }

        console.log("done indexing")
        let pages = ["gacha", "events", "daily"]
        for await (const page of pages) {
            fs.copyFileSync(local + "/index.html", local + "/" + page + "/index.html")
            await index.addByPath(page + "/index.html")
        }
        await index.write();
        const oid = await index.writeTree();
        const parent = await repo.getHeadCommit();
        const author = nodegit.Signature.now("auto",
            "auto");
        const committer = nodegit.Signature.now("auto",
            "auto");
        /*exec('git add *', {cwd: local}, (error, stdout, stderr) => {
            fs.rmSync(local, { recursive: true, force: true });
            exec('git commit -m "a"', {cwd: local}, (error, stdout, stderr) => {
                fs.rmSync(local, { recursive: true, force: true });
                exec('git push', {cwd: local}, (error, stdout, stderr) => {
                    fs.rmSync(local, { recursive: true, force: true })
                })
            })
        })*/


        console.log("Cloned " + path.basename(url) + " to " + repo.workdir());
        console.log("committing")
        execSync('git commit -m "a"', {cwd: local})
        console.log("commited, pushing")
        execSync('git push', {cwd: local})
        console.log("pushed")
        /*const commitId = await repo.createCommit("HEAD", author, committer, "message", oid, [parent]);

        console.log("New Commit: ", commitId);
        const remote = await repo.getRemote('origin');
        console.log("awaited")
        let a = await remote.push(
            ["refs/heads/master:refs/heads/master"],
            {
              callbacks: {
                  credentials: (url, user) => cred
              }
            }
          );
        console.log(a)*/
    }).then(function () {
        console.log("done")
    }).catch(function (err) {
        console.log(err);
    })
}

ha()
