const fs = require('fs');

// Function to get the five most dominant colors of an image sorted by brightness

// I will now send you arrays that are mostly in Japanese and you will translate them to English, bearing in mind that most of the words that are already in English are the proper terms that should be kept no matter what

// This conversation will go like this

// Me: 
// You: []


// I will send you JSON arrays in Japanese and you will translate them to JSON arrays in English while keeping the terms that are already in English intact,

// also, keep in mind that と追い打ち stands for "additional damage", do not assign a term to it.

// Translate the Japanese in this JSON array to English, while keeping in mind that と追い打ち stands for "additional damage", do not assign a term to it. Keep the Array brackets.



// Translate the Japanese in this JSON array to English, while keeping in mind that と追い打ち stands for "additional damage", do not assign a term to it. Keep the Array brackets. Leave "< Pact 15 >" as is without changing how its written. Also make sure to mind proper capitalization of words. Use third person without pronouns or names. Instead of using "itself", use "oneself".

function replaceJapaneseText(str) {
  let TLs = [
	["攻撃力ＵＰ", "Attack Up"],
	["ダメージカット", "Damage Cut"],
	["ダメージ無効", "Damage Immune"],
	["蘇生", "Resurrection"],
	["攻撃力ＤＯＷＮ", "Attack Down"],
	["火傷", "Burn"],
	["呪い", "Curse"],
	["ダメージカット封印", "Damage Cut Seal"],
	["バリア", "Barrier"],
	["ずぶ濡れ", "Drenched"],
	["治癒", "Recovery"],
	["HP依存ダメージ上限", "HP-based Damage Limit"],
	["縛鎖", "Chained"],
	["攻撃間隔短縮", "Attack Speed Up"],
	["回避", "Evade"],
	["回復力ＵＰ", "Healing Up"],
	["状態異常耐性", "Abnormal Status Immune"],
	["毒", "Poison"],
	["気絶", "Stun"],
	["攻撃力ＵＰ封印", "Attack Up Seal"],
	["帯電", "Electrify"],
	["感電", "Shock"],
	["かばう", "Cover"],
	["畏縮", "Fear"],
	["吸収", "Leech"],
	["HP依存ダメージ上限上昇", "HP-based Damage Limit Increase"],
	["敵視", "Hostility"],
	["気力上昇速度UP", "Zeal Gain Up"],
	["戦力", "Combat Strength"],
	["HP", "HP"],
	["攻撃力", "Attack"],
	["攻撃速度", "Attack Speed"],
	["攻撃回数", "Hit Count"],
	["回復力", "Healing"],
	["回復速度", "Healing Speed"],
	["回復回数", "Heal Count"],
	["連撃初段", '1st Chain Attack'],
	["連撃弐段", '2nd Chain Attack'],
	["連撃参段", '3rd Chain Attack'],
	["必殺連撃", 'Chain Attack'],
	["気力", "Zeal"],
	["連撃", 'Chain Attack'],
	["永続", 'Perpetual'],
  ["累積", 'Stacking'],
  ["累積なし", 'Non-Stacking'],
  ["ゲージ", 'gauge'],
  ["活命", 'Health'],
  ["リジェネ", 'Regeneration'],
  ["蓄積", 'Accumulation'],
  ["蓄積", 'High Accumulation'],
  ["特性Lv15時", 'Pact 15'],
  ["会心超過", 'Element Advantage'],
    // ["と追い打ち", "as well as"],
  ]
  TLs.sort((a, b) => b[0].length - a[0].length);
  TLs.forEach((TL) => {
	str = str.replaceAll(TL[0], TL[1])
  })
  str = str.replace(/\([0-9]+回\)/g, function(match) {
      return match.replace("回", "x");
  });
  str = str.replace(/\([0-9]+秒\)/g, function(match) {
    return match.replace("秒", "s");
});
  return str;
}

function translateSmall(str) {
  let TLs = [
    ["秒", "s"],

    ["風", "Wind"],
    ["闇", "Dark"],
    ["無", "None"],

    ["光", "Light"],
    ["土", "Earth"],
    ["火", "Fire"],
    ["水", "Water"],

    ["2属性", ""],
    ["4属性", "Fire/Water/Earth/Wind"],
    ["(", ""],
    [")", ""],

    ["回", ""],


    ["遅", "Slow"],
    ["並", "Normal"],
    ["早", "Fast"],
    ["超遅", "Very Slow"],
    ["超早", "Very Fast"],

    ["近接・遠隔", "All"],
    ["近接", "Front"],
    ["遠隔", "Back"],


    
    // ["と追い打ち", "as well as"],
  ]
  TLs.sort((a, b) => b[0].length - a[0].length);
  TLs.forEach((TL) => {
	str = str.replaceAll(TL[0], TL[1])
  })
  return str;
}

function getBrighterColor(colors) {
    // Calculate the brightness of each color
    const brightnesses = colors.map(color => {
      const [r, g, b] = color._rgb;
      return r * 0.299 + g * 0.587 + b * 0.114;
    });
    
    // Find the index of the color with the highest brightness
    const brighterIndex = brightnesses.indexOf(Math.max(...brightnesses));
    
    // Return the color with the highest brightness
    return brighterIndex;
}

function compareFn(a, b) {
    return (getBrighterColor([a, b]) == 0)
}

function sortColorsByBrightness(colors) {
    return colors.sort((a, b) => {
        const brightnessA = (0.2126 * a._rgb[0]) + (0.7152 * a._rgb[1]) + (0.0722 * a._rgb[2]);
        const brightnessB = (0.2126 * b._rgb[0]) + (0.7152 * b._rgb[1]) + (0.0722 * b._rgb[2]);
        return brightnessA - brightnessB;
      });
  }

const getDominantColors = async (imageUrl) => {
  const gic = require('get-image-colors');
  try {
    const colors = await gic(imageUrl);
    let sortedColors = colors.slice(0, 5)
    sortedColors = sortColorsByBrightness(sortedColors)
    console.log(sortedColors)
    return sortedColors.map((color) => `${color._rgb[0]}, ${color._rgb[1]}, ${color._rgb[2]}`);
  } catch (error) {
    console.error(error);
  }
};

const main = async () => {
  // Read input file
  const input = JSON.parse(fs.readFileSync('input.json', 'utf8'));

  // Modify the input array by adding a DominantColors property to each object
  const output = await Promise.all(input.map(async (obj) => {
    const dominantColors = await getDominantColors(obj.Pact5);
    return { ...obj, DominantColors: dominantColors };
  }));

  // Write output file
  fs.writeFileSync('output.json', JSON.stringify(output, null, 2));
};

function mainer()
{
  let newobj = []
  let chars = []
  const input = JSON.parse(fs.readFileSync('input.json', 'utf8'));
  let div = Math.floor(input.length/20);
  let count = 0;
  let file = 0;

  input.forEach((obj) => {
    chars[obj.EnglishName] = (chars[obj.EnglishName] ?? 0) + 1;
    newobj.push([obj.EnglishName + chars[obj.EnglishName], replaceJapaneseText(obj.C1Description), replaceJapaneseText(obj.C2Description), replaceJapaneseText(obj.C3Description), replaceJapaneseText(obj.Passive1), replaceJapaneseText(obj.Passive2), replaceJapaneseText(obj.NormalDesc)])
    count++;
    console.log(count, div)
    if (count == div || obj == input[input.length-1])
    {
      file++;
      fs.writeFileSync(`output${file}.json`, JSON.stringify(newobj, null, 2));
      newobj = [];
      count = 0;
    }
  })

  // fs.writeFileSync('output.json', JSON.stringify(newobj, null, 2));
}

function mainest()
{
  let newobj = []
  const input = JSON.parse(fs.readFileSync('input.json', 'utf8'));

  input.forEach((obj) => {
    newobj.push({Icon: obj.Icon, Art: [obj.Pact1, obj.Pact5]})
  })

  fs.writeFileSync('output.json', JSON.stringify(newobj, null, 2));
}

function meanester()
{
    let newobj = []
    let elements = []
    let speeds = []
    let position = []
    let hits = []
    let cooldown = []
    const input = JSON.parse(fs.readFileSync('input.json', 'utf8'));
    let div = Math.floor(input.length/20);
    let count = 0;
    let file = 1;
    let target = JSON.parse(fs.readFileSync(`output${file}.json`, 'utf8'));

    input.forEach((obj) => {
      // console.log(obj.EnglishName + " VS " + target[count][0])
      // obj.C1Description = target[count][1];
      // obj.C2Description = target[count][2];
      // obj.C3Description = target[count][3];
      // obj.Passive1 = target[count][4];
      // obj.Passive2 = target[count][5];
      // obj.NormalDesc = target[count][6];
      obj.Element = translateSmall(obj.Element);
      obj.NormalSpeed = translateSmall(obj.NormalSpeed);
      obj.Position = translateSmall(obj.Position);
      obj.NormalTimes = translateSmall(obj.NormalTimes);
      obj.C1Cooldown = translateSmall(obj.C1Cooldown);
      obj.C2Cooldown = translateSmall(obj.C2Cooldown);
      obj.C3Cooldown = translateSmall(obj.C3Cooldown);
      
      // elements[obj.Element] = 1;
      // speeds[obj.NormalSpeed] = 1;
      // position[obj.Position] = 1;
      // hits[obj.NormalTimes] = 1;
      // cooldown[obj.C1Cooldown] = 1;
      // cooldown[obj.C2Cooldown] = 1;
      // cooldown[obj.C3Cooldown] = 1;
      count++;
      newobj.push(obj);
      if (count == div)
      {
        file++;
        target = JSON.parse(fs.readFileSync(`output${file}.json`, 'utf8'));
        count = 0;
      }
    })
    fs.writeFileSync('output.json', JSON.stringify(newobj, null, 2));
    // fs.writeFileSync('elements.json', JSON.stringify(Object.keys(elements), null, 2));
    // fs.writeFileSync('speeds.json', JSON.stringify(Object.keys(speeds), null, 2));
    // fs.writeFileSync('position.json', JSON.stringify(Object.keys(position), null, 2));
    // fs.writeFileSync('hits.json', JSON.stringify(Object.keys(hits), null, 2));
    // fs.writeFileSync('cooldown.json', JSON.stringify(Object.keys(cooldown), null, 2));

}

function addSpaces(string) {
  const regex = /(^|[^\w.])(\d+(\.\d+)?%?)|(\d+(\.\d+)?%?)([^\w.]|$)/g;
  return string.replace(regex, '$1 $2 $6 ');
}

function mainestest()
{
  const input = JSON.parse(fs.readFileSync('input.json', 'utf8'));
  let output = [];
  input.forEach((obj)=> {
    ["C1Description", "C2Description", "C3Description", "NormalDesc", "Passive1", "Passive2"].forEach((val)=> {
        obj[val] = addSpaces(obj[val]);
    })
    output.push(obj);
  })
  fs.writeFileSync('output.json', JSON.stringify(output, null, 2));
}

main();