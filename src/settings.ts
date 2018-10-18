module powerbi.extensibility.visual {
  "use strict";
  import DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;

  export class VisualSettings extends DataViewObjectsParser {
    public legend: legendSettings = new legendSettings();
    public vor: VorSettings = new VorSettings();
  }

  export class legendSettings {
    public show: boolean = true;
  }

  export class VorSettings {
    public show: boolean = false;
    public lowColor: string = "#f44336";
    public middleColor: string = "#ff9800";
    public highColor: string = "#4caf50";
    public firstValue: number = 25;
    public secondValue: number = 75;
  }
}
