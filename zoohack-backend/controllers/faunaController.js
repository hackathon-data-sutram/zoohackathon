var faunaModel = require("../models/faunaModel");
exports.getKeywords = async (req, res) => {
    console.log("body is", req.body);
    faunaModel.getKeywords(req.body.tag, function(data) {
        // console.log(data);
        var keywords = {};
        data.forEach((elment) => {
            elment.Keywords.forEach((eachKeywords) => {
                keywords[eachKeywords] = keywords[eachKeywords] > 0 ? keywords[eachKeywords]++ : 1;
            });
        });
        let uniqueKeywords = Object.keys(keywords).map((key) => {
            return [key, keywords[key]];
        })
        uniqueKeywords.sort((first, second) => {
            return first[1] - second[1];
        })
        let uniqueKeywordsList = uniqueKeywords.map((keyword) => {
            return keyword[0]
        })
        console.log(uniqueKeywordsList.slice(0,50));
        res.send({keywords: uniqueKeywordsList.slice(0,50)});
    });
};

exports.getSpecies = async (req, res) => {
    var type1 = await faunaModel.find({}, {Type_1: true}).distinct("Type_1").then((result) => {
        return result;
    });
    var type2 = await faunaModel.find({}, {Type_2: true}).distinct("Type_2").then((result) => {
        return result;
    });
    var type3 = await faunaModel.find({}, {Type_3: true}).distinct("Type_3").then((result) => {
        return result;
    });
    var sendSpecies = [];
    type1.forEach((element) => {
        sendSpecies.push(element)
    });
    type2.forEach((element) => {
        sendSpecies.push(element)
    });
    type3.forEach((element) => {
        sendSpecies.push(element)
    });
    res.send(sendSpecies);
}

exports.findByKeywords = (req, res) => {
    console.log('body is', req.body);
    let tag = req.body.tag;
    let keywords = req.body.keywords;
    faunaModel.findByKeywords(tag, keywords, function(data){
        res.send({objects: data});
    });
}
