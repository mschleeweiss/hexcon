export const generateName = function() {
    const pre = ["Hairy", "Slimey", "Ugly", "Brave", "Horny", "Quirky", "Angry", "Fluffy", "Godly", "Dirty", "Moody"];
    const suf = ["Muggle", "Hobbit", "Ogre", "Orc", "Monster", "Grinch", "Weasel"];

    const preName = pre[Math.floor(Math.random() * pre.length)];
    const sufName = suf[Math.floor(Math.random() * suf.length)];

    return `${preName} ${sufName}`;
}