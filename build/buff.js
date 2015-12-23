'use strict';

var pipe = {

    properties: {

        id: [{
            $range: {
                min: {
                    value: 1,
                    message: 'id must be more than {value}'
                }
            }
        }],
        institution: [['exist', 'institution', 'Unknown institution {value}!'], ['unique', 'institution', '{value} exists!'], ['max', 10, 'Your nuts are too big {value}'], ['min', 1]]

    }

};