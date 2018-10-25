module powerbi.extensibility.visual {
    "use strict";
    export class Visual implements IVisual {
        private svg: d3.Selection<d3.BaseType, {}, null, undefined>;
        private settings: VisualSettings;
        private gcontainer: d3.Selection<d3.BaseType, {}, null, undefined>;
        private pie = d3.pie().sort(null).value(d => <any>d);
        private color1 = ["#003A84", "#00B0E8"]; // 14980, 45288 ->> 7664
        private color2 = ["#30629D", "#3DC0ED"]; // 3170973, 4047085 ->> 876112
        private path1: d3.Selection<d3.BaseType, d3.PieArcDatum<number | { valueOf(): number }>, d3.BaseType, {}>;
        private path2: d3.Selection<d3.BaseType, d3.PieArcDatum<number | { valueOf(): number }>, d3.BaseType, {}>;
        private text: d3.Selection<d3.BaseType, {}, d3.BaseType, {}>;
        private bottom_container: HTMLElement;
        private legend_text: Text;

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
                .attr('text-anchor', 'middle');

            this.bottom_container = document.createElement("div");
            this.bottom_container.className = "none";

            this.legend_text = this.bottom_container.appendChild(document.createTextNode(""));
            this.bottom_container.appendChild(this.legend_text);
            options.element.appendChild(this.bottom_container);
        }

        public update(options: VisualUpdateOptions) {
            this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);

            const legend_text = Visual.getcategory(options.dataViews[0].categorical, "legend");
            const avec_legend = this.settings.legend.show && legend_text;

            this.bottom_container.className = avec_legend ? "bottom_container" : "none";
            this.legend_text.textContent = legend_text;
            this.bottom_container.style.color = this.settings.legend.color;
            this.bottom_container.style.fontSize = `${this.settings.legend.fontsize}px`;
            this.bottom_container.style.whiteSpace = this.settings.legend.retourligne ? "normal" : "nowrap";
            this.bottom_container.style.fontWeight = this.settings.legend.bold ? 'bold': 'normal';
            this.bottom_container.style.fontFamily = this.settings.legend.fontFamily;

            const legend_height = avec_legend ? this.bottom_container.offsetHeight : 0;

            var radius = Math.min(options.viewport.width, options.viewport.height - legend_height) / 2;
            this.svg.attr("width", options.viewport.width);
            this.svg.attr("height", radius * 2);
            this.gcontainer.attr("transform", `translate(${options.viewport.width / 2}, ${radius})`);

            const multiplicateur = this.settings.shape.percent ? 100 : 1;
            let value_text = Visual.getvalue(options.dataViews[0].categorical, "value_text");
            value_text = isNaN(value_text) || value_text == null ? "" : `${Math.round(+value_text*multiplicateur)}%`;
            const value_arc = +Visual.getvalue(options.dataViews[0].categorical, "value_arc")*multiplicateur;
            const vor_flag = +Visual.getvalue(options.dataViews[0].categorical, "vor_flag");

            const arc_width = this.settings.shape.arc_linesize;
            const arc1 = d3.arc().outerRadius(radius).innerRadius(radius - arc_width);
            const arc2 = d3.arc().outerRadius(radius - arc_width + 1).innerRadius(radius - arc_width * 2);

            this.path1.data(this.pie([value_arc, 100 - value_arc]))
                .style("fill", d => this.color1[d.index])
                .attr("d", <any>arc1);

            this.path2.data(this.pie([value_arc, 100 - value_arc]))
                .style("fill", d => this.color2[d.index])
                .attr("d", <any>arc2);

            this.text.data([value_text])
                .style('fill', Visual.getVorColor(this.settings, vor_flag))
                .style('font-size', `${this.settings.shape.text_size}vmin`)
                .style('vertical-align', `text-top`)
                .text(d => d);

            const text_height = (<any>this.text.node()).getBoundingClientRect().height;
            console.log(text_height)
            this.text.attr("dy", `${text_height / 2 - 12}px`);
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }

        public static getvalue(categorical: DataViewCategorical, name: string): any {
            const item = categorical.values.filter(f => f.source.roles[name]).map(m => m.values[0]);

            if (item && item.length === 1) {
                return item[0];
            }
        }

        public static getcategory(categorical: DataViewCategorical, name: string): any {
            if (categorical.categories) {
                const item = categorical.categories.filter(f => f.source.roles[name]).map(m => m.values[0]);

                if (item && item.length === 1) {
                    return item[0];
                }
            }
        }

        private static getVorColor(settings: VisualSettings, value: number): string {
            if (settings.vor.show && value) {
                switch (value) {
                    case 1: return settings.vor.lowColor;
                    case 10: return settings.vor.middleColor;
                    case 100: return settings.vor.highColor;
                }
            }

            return settings.shape.text_color;
        }
    }
}