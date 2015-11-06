/**
 * Created by chenhao on 15/10/27.
 */

describe('Collection: Modules', function () {
    'use strict';

    beforeEach(function () {
        MeteorStubs.install();
        mock(global, 'Collections.Modules');
    });

    afterEach(function () {
        MeteorStubs.uninstall();
    });

    describe('moduleInsert', function () {
        it('', function () {
            var result = {};
            spyOn(Collections.Modules, 'find').and.returnValue(result);

            expect(PlayersService.getPlayerList()).toBe(result);
            expect(Collections.Modules.find.calls.argsFor(0)).toEqual([{}, {sort: {score: -1, name: 1}}]);
        });
    });

});
