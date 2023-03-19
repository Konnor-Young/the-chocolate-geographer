const Coco = require('./model');

POSThelper = function(req){
    return {
        'chocolate': req.chocolate || "",
        'locale': req.locale || '',
        'inventory': req.inventory || 0
    };
};
DateHelper = function(req){
    return{
        'date': req.date,
        'seats': req.seats || 12,
    };
};
SeatsHelper = async function(req){
    const dateInstance = await Coco.Dates.findOne({date: req.date});
    // console.log(dateInstance, 'date instance for helper')
    const dateRef = dateInstance ? dateInstance : null;
    return {
        'name': req.name,
        'party': req.party,
        'date': req.date,
        'dateRef': dateRef
    };
};
updateHelper = function(req){
    return req.seats;
}

module.exports = {
    POSThelper: POSThelper,
    DateHelper: DateHelper,
    SeatsHelper: SeatsHelper,
    updateHelper: updateHelper,
};