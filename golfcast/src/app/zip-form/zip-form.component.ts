import {Component, OnInit, Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from "rxjs";

//noinspection ES6ConvertVarToLetConst
declare var jQuery: any;

@Component({
  selector: 'app-zip-form',
  templateUrl: './zip-form.component.html',
  styleUrls: ['./zip-form.component.css']
})
@Injectable()
export class ZipFormComponent implements OnInit {

  constructor(private http: Http) {
  }

  zip = "";

  onSubmit(form: any): void {
    console.log('Submitted zipcode:', form.zip);
    let url = 'http://104.198.106.224:8889?zipcode=' + form.zip;
    console.log('Getting courses near zipcode:' + url);
    this.http.get(url)
      .map(this.extractCoursesAndWeather.bind(this))
      .catch(ZipFormComponent.handleError).subscribe();
  }

  private static handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  extractCoursesAndWeather(res: Response) {
    let courses = res.json();
    console.log(JSON.stringify(courses));
    let indicators = jQuery("#carousel-indicators");
    let inner = jQuery("#carousel-inner");
    let images = ['assets/img/c1.jpg', 'assets/img/c2.jpg', 'assets/img/c3.jpg'];
    for (let i = 0, len = Math.min(courses.length, 5); i < len; i++) {
      let name = courses[i]['name'];
      let lat = courses[i]['lat'];
      let lng = courses[i]['lng'];
      let url = 'http://104.198.11.90:8888?lat=' + lat + '&lng=' + lng;
      console.log('Getting weather for lng/lat: ' + url);

      indicators.append('<li data-target="#courses-carousel" data-slide-to="' + i + '" ' + ((i === 0) ? 'class="active"' : '') + '></li>');
      inner.append('<div class="carousel-item' + ((i === 0) ? ' active' : '') + '"><img src="' + images[i % images.length] + '"><div style="top:-10px" class="carousel-caption" id="course' + i + '"><h3>' + name + '</h3></div></div>');

      let caption = inner.find('#course' + i);
      let f = function (response: Response) {
        caption.append('<div> \
          <table class="table table-inverse" style="margin-left:auto;margin-right:auto;"> \
           <thead> \
         <tr> \
           <th>Time</th> \
       <th>Conditions</th> \
       <th>Temperature</th> \
       <th>Wind</th> \
       </tr> \
       </thead><tbody></tbody></table>');

        let weather = response.json();
        let table = caption.find('tbody');
        for (let ii = 0, ilen = Math.min(weather.length, 6); ii < ilen; ii++) {
          let w = weather[ii];
          let d = new Date(0);
          d.setUTCSeconds(w['EpochDateTime']);

          let temp = (w['Temperature']['Value']) + (w['Temperature']['Unit']);
          let wind = (w['Wind']['Speed']['Value']) + ' ' + (w['Wind']['Direction']['English']);
          table.append('<tr><th scope="row">' + d.getHours() + '</th><td>' + w['IconPhrase'] + '</td><td>' + temp + '</td><td>' + wind + '</td></tr>');
        }
      };

      this.http.get(url)
        .map(f)
        .catch(ZipFormComponent.handleError).subscribe();
    }
    ZipFormComponent.displayModal();
  }

  private static displayModal() {
    let modal = jQuery("#disp");
    modal.on('hidden.bs.modal', function () {
      jQuery("#carousel-indicators").empty();
      jQuery("#carousel-inner").empty();
      jQuery("#zform").trigger('reset');
    });
    modal.modal({show: true});
  }

  ngOnInit() {
  }

}



