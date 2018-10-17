module powerbi.extensibility.visual {
    "use strict";
    export class Visual implements IVisual {
        private svg: d3.Selection<d3.BaseType, {}, null, undefined>;
        private settings: VisualSettings;
        private gcontainer: d3.Selection<d3.BaseType, {}, null, undefined>;
        private pie = d3.pie().sort(null).value(d => <any>d);
        private color1 = d3.scaleOrdinal().range(["#003A84", "#00B0E8"]);
        private color2 = d3.scaleOrdinal().range(["#30629D", "#3DC0ED"]);
        private path1: d3.Selection<d3.BaseType, d3.PieArcDatum<number | { valueOf(): number }>, d3.BaseType, {}>;
        private path2: d3.Selection<d3.BaseType, d3.PieArcDatum<number | { valueOf(): number }>, d3.BaseType, {}>;
        private text: d3.Selection<d3.BaseType, {}, d3.BaseType, {}>;;

        constructor(options: VisualConstructorOptions) {
            this.svg = d3.select(options.element).append('svg');
            this.gcontainer = this.svg.append('g').classed('percenter', true);
            this.path1 = this.gcontainer.append("g").selectAll("path").data(this.pie([0, 100])).enter().append("path");
            this.path2 = this.gcontainer.append("g").selectAll("path").data(this.pie([0, 100])).enter().append("path");

            this.text = this.gcontainer
                .append('g')
                .selectAll('text')
                .data([''])
                .enter()
                .append('text')
                .attr("dy", "0.6ex")
                .attr('text-anchor', 'middle');
        }

        public update(options: VisualUpdateOptions) {
            console.log(options.dataViews[0]);
            this.svg.attr("width", options.viewport.width);
            this.svg.attr("height", options.viewport.height);
            this.gcontainer.attr("transform", `translate(${options.viewport.width / 2}, ${options.viewport.height / 2})`);

            var value = 70;
            var textvalue = 54;
            var textcolor = "#000";
            var radius = Math.min(options.viewport.width, options.viewport.height) / 2;
            var arc_width = 20;

            var arc1 = d3.arc().outerRadius(radius).innerRadius(radius - arc_width);
            var arc2 = d3.arc().outerRadius(radius - arc_width + 1).innerRadius(radius - arc_width * 2);

            this.path1.data(this.pie([value, 100 - value]))
                .style("fill", d => <any>this.color1(<any>d.data))
                .attr("d", <any>arc1);

            this.path2.data(this.pie([value, 100 - value]))
                .style("fill", d => <any>this.color2(<any>d.data))
                .attr("d", <any>arc2);

            this.text.data([textvalue])
                .style('fill', textcolor)
                .style('font-size', `${24}vmin`)
                .text(d => d + '%');
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }
    }
}