import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})
export class GraphsComponent implements OnInit, OnChanges {

  @Input() priceData: any;
  @Input() numberData: any;
  numberChart: any;
  priceChart: any;

  constructor() {
  }

  ngOnInit() {
    this.initializeCharts();
  }

  initializeCharts() {

    var ctx1 = (document.getElementById('numberChart') as HTMLCanvasElement);
    this.numberChart = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Adverts',
          data: [0],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

    var ctx2 = (document.getElementById('priceChart') as HTMLCanvasElement);
    this.priceChart = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: 'Average Price',
          data: [0],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    })
  }

  ngOnChanges() {
    if (this.priceChart && this.numberChart ) {
      console.log(this.priceData, this.numberData);
      this.priceChart.data.datasets[0].data = this.priceData.prices,
      this.priceChart.data.labels = this.priceData.dates,
      this.numberChart.data.datasets[0].data = this.numberData.numbers,
      this.numberChart.data.labels = this.numberData.dates,
      this.priceChart.update(),
      this.numberChart.update();
    }
  }

}
