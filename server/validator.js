function validateAttributes(params) {
    return (req, res, next) => {
        let missing = [];
        console.log(req);
        let body = req.body;
        for (let param of params) {
            if (body[param] === undefined) {
                missing.push(param);
            }
        }
        if (missing.length === 0) {
            next();
            return;
        }
        res.status(400)
            .json({
                'message': 'Request lacks required parameter(s).',
                'missing': missing
            });
    }
}

module.exports = ({
    requiredAttributes: validateAttributes,
});
