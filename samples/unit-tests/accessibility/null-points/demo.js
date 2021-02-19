QUnit.test('Null points are described to screen readers', function (assert) {
    const chart = Highcharts.chart('container', {
            series: [
                {
                    data: [1, null, null, 2, 3, 4, 5, 6]
                }
            ]
        }),
        series = chart.series[0],
        regularPoint = series.points[0],
        nullPoint = series.points[1],
        getPointAttr = (point, attr) =>
            point.graphic.element.getAttribute(attr);

    assert.ok(getPointAttr(regularPoint, 'aria-label'));
    assert.ok(getPointAttr(nullPoint, 'aria-label'));
});

QUnit.test('Dynamic null points', function (assert) {
    const chart = Highcharts.chart('container', {
            series: [
                {
                    data: [1, null, null, 2, 3, 4, 5, 6]
                }
            ]
        }),
        series = chart.series[0],
        nullPoint = series.points[1];

    nullPoint.update({
        y: 3
    });

    assert.notOk(
        nullPoint.graphic.element.hasAttribute('fill-opacity'),
        'Point should not have dummy hiding attributes after update.'
    );
    assert.strictEqual(
        nullPoint.graphic.element.tagName,
        'path',
        'Point should not have the old dummy marker graphic, but a new marker element.'
    );

    nullPoint.update({
        y: null
    });

    assert.ok(
        nullPoint.graphic.element.hasAttribute('fill-opacity'),
        'Point should have dummy hiding attributes after update to null point.'
    );
    assert.strictEqual(
        nullPoint.graphic.element.tagName,
        'rect',
        'Point should have a new dummy marker graphic after update to null point.'
    );
});

// Issue #14966
QUnit.test('Updating null point', assert => {
    const chart = Highcharts.chart('container', {
        series: [{
            data: [{
                x: 1,
                y: 20
            }, {
                x: 2,
                y: null
            }, {
                x: 3,
                y: 20
            }, {
                x: 4,
                y: 30
            }]
        }]
    });

    chart.series[0].points[1].select(true, true);

    assert.notStrictEqual(
        chart.series[0].points[1].graphic.y,
        NaN,
        'Point graphic y shouldn\'t be NaN.'
    );
});