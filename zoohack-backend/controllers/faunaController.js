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

exports.findByKeywords = (req, res) => {
    console.log('body is', req.body);
    let tag = req.body.tag;
    let keywords = req.body.keywords;
    faunaModel.findByKeywords(tag, keywords, function(data){
        res.send({objects: data});
    });
}
