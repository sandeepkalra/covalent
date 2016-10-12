import { AfterViewInit } from '@angular/core';
import { TdChartsComponent } from './charts.component';

/* tslint:disable-next-line */ 
let d3: any = require('d3');

export interface IChartData {
  [key: string]: any;
}

export abstract class ChartComponent implements AfterViewInit {

  protected _margin: any = {top: 50, right: 150, bottom: 50, left: 50};
  protected _width: number;
  protected _height: number;
  protected _padding: number;
  protected _initialized: boolean = false;

  protected _parentObj: TdChartsComponent;
  protected _chartTitle: string;
  protected _leftAxisTitle: string;
  protected _bottomAxisTitle: string;
  protected _dataSrc: string = '';
  protected _data: IChartData[];

  constructor(parent: TdChartsComponent) {
    this._parentObj = parent;
  }

  ngAfterViewInit(): void {
    this._chartTitle = this._parentObj.chartTitle;
    this._leftAxisTitle = this._parentObj.leftAxisTitle;
    this._bottomAxisTitle = this._parentObj.bottomAxisTitle;
    this._initialized = true;
    this.drawChart();
  }

  setData(data: IChartData[]): void {
    this._data = data;
    if (this._initialized) {
      this.drawChart();
    }
  }

  setDataSrc(dataSrc: string): void {
    this._dataSrc = dataSrc;
    if (this._initialized) {
      this.drawChart();
    }
  }

  refresh(): void {
    this.drawChart();
  }

  protected drawChart(): void {
    this._margin.top = 50;
    this._width = 960 - this._margin.left - this._margin.right;
    this._height = this._parentObj.chartHeight - this._margin.top - this._margin.bottom;
    this._padding = 100;

    if (this._data) {
      this.renderChart(this._data);
    } else if (this._dataSrc) {
      enum ParseContent {
        json = d3.json,
        csv = d3.csv,
        tsv = d3.tsv
      }
      let contentType: string = this._dataSrc.substr(this._dataSrc.lastIndexOf('.') + 1);
      ParseContent[contentType](this._dataSrc, (error: string, data: any) => {
        if (error) { throw error; }
        this.renderChart(data);
      });
    } else {
      throw '[data] or [dataSrc] must be defined in [TdChartLineComponent]';
    }
  }

  protected abstract renderChart(data: any): void;

}
