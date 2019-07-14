module.exports = {
    isJson: function(string) {
        let value = true;
        try {
            JSON.parse(string);
        }
        catch (e) {
            value = false;
        }

        return value;
    },
};
