var app = new Vue({
  el: '#app',
  data: {
    categorySet: {},
    currentWordObject: { word: 'Loading...' },
    currentWordIndex: 0,
    results: { data: [] },
    totalWords: 1,
    dev_jsonIndex: 0 // 開発用
  },
  methods: {
    // データをロードする
    loadData: function () {

      // 表示データを取得する
      this.fetchData()
        .then(data => {
          this.categorySet = data;
          this.currentWordObject = this.categorySet[this.currentWordIndex];
          // 現在サンプルデータのみ使用するので次処理実行用
          this.dev_jsonIndex++;
        })
        .catch(err => console.error(err))

    },
    // ポイント加算：wordが属するcategoryに対してpointを加算する
    addPoint: function (point) {
      console.log(`adding ${point}point to ${this.currentWordObject.categories}`);

      for (category of this.currentWordObject.categories) {
        if (this.results.data[category]) {
          this.results.data[category] = this.results.data[category] + point;
        } else {
          this.results.data[category] = point;
        }
      }

      // // resultsオブジェクトの作り方を変えるコード(WIP)
      // for (category of this.currentWordObject.categories) {
      //   for (i = 0; this.results.data[i]; i++) {
      //     if (category === this.results.data[i].category) {
      //       this.results.data[i]['categoryPoints'] = point + this.results.data[i][`categoryPoints`];
      //       console.dir(this.results.data);
      //     }
      //   }
      // }
      // console.dir(this.results.data);

      // 次の単語オブジェクトをセットする
      this.currentWordObject = this.categorySet[++this.currentWordIndex];

      // カテゴリ内最後の単語、次のカテゴリセットに移る。
      //  TODO: pageview_rankに対してカテゴリポイントが一定以下の場合
      // ポイントに応じた分岐処理を書く
      // var categoryPointSum;
      // for (i = 1; i <= 4; i++) {
      //   if (this.currentWordIndex == (4 * i) && this.results.data[category] < categoryPointSum + 13) {
      //    this.currentWordIndex = 0;
      //    this.loadData();
      //  }
      //   categoryPointSum = this.results.data[category];
      // }

      if (!this.currentWordObject) {
        this.currentWordObject = { word: 'Loading...' };
        this.currentWordIndex = 0;
        this.loadData();
      }

      this.totalWords++;


    },
    // BarChartを描画する
    drawChart: function () {
      google.charts.load('current', { packages: ['corechart', 'bar'] });
      google.charts.setOnLoadCallback(drawBasic);

      let self = this;

      function drawBasic() {

        let resultArray = [];
        console.log(self.results.data);

        for (category in self.results.data) {
          resultArray.push([category, self.results.data[category]]);
        }
        // _(lodash)を利用して配列をソート TODO:カラム名でソートされてしまっているのでfix
        resultArray = _.sortBy(resultArray);
        // グラフ描画に利用するラベル
        resultArray.unshift(['カテゴリ', '知識ポイント'])

        let data = google.visualization.arrayToDataTable(resultArray);

        var dynamicHeight = data.getNumberOfRows() * 30;
        var chartHeight = dynamicHeight + 100;

        var options = {
          title: 'あなたの知識', 
          height: chartHeight,
          chartArea: { width: '50%' },
          hAxis: {
            title: '知識ポイント',
            minValue: 0
          },
          vAxis: {
            title: 'カテゴリ'
          }
        };

        const chart = new google.visualization.BarChart(document.getElementById('chart_div'));

        chart.draw(data, options);
        // TODO: グラフがフェードで現れるようにしたい
      }
    },
    // データ取得：指定のURLまたはJSONファイルにアクセスし、データを取得する
    fetchData: function () {

      return new Promise((resolve, reject) => {
        const fetchOptions = {
          method: 'GET',
        }

        fetch(`./assets/testdata${this.dev_jsonIndex}.json`, fetchOptions)
          .then(response => response.json())
          .then(data => {
            resolve(data.data)
          })
          .catch(err => {
            console.log(`ERR ${err}`);
            this.currentWordObject.word = 'DONE :)'
            this.drawChart();
            reject(err);
          });
      })
    },
    sampleMethod: function (data) {
      console.log(`sample called ${data}`)
    }
  },
  created: function () {
    this.loadData();
  }
})
