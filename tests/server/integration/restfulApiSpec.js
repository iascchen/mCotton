/**
 * Created by chenhao on 15/10/27.
 */

describe('Collection: Modules', function () {
    'use strict';

    it('some players are available in the collection', function () {
        expect(Collections.Modules.find().count()).toBeGreaterThan(0);
    });
});
