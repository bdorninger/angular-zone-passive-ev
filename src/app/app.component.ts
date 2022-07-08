import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  VERSION,
  ViewChild,
} from '@angular/core';
import * as d3d from 'd3-drag';
import * as d3s from 'd3-selection';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  public name = 'Angular ' + VERSION.major;

  @ViewChild('mydiv', {
    read: ElementRef,
    static: true,
  })
  public mydiv: ElementRef;

  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout(
      () =>
        (this.name = this.mydiv != null ? 'MYDIV injected' : 'Nothing there'),
      100
    );
    if (this.mydiv) {
      const ndiv = this.mydiv.nativeElement as HTMLDivElement;

      // the "evil" event registration: causes globalZoneAwareCallback for 'touchmove' to become passive
      ndiv.addEventListener(
        'touchmove',
        (ev) => {
          console.log('move passive! ', ev);
          //ev.preventDefault();
          //ev.stopImmediatePropagation();
        },
        {
          passive: true,
        }
      );

      // this one is configured non-passive. browser considers it active
      ndiv.addEventListener(
        'touchmove',
        (ev) => {
          console.log('move active! ', ev);
          ev.preventDefault();
          //ev.stopImmediatePropagation();
        },
        {
          passive: false,
        }
      );

      // although d3 tries to register its touchmove handler as active, the zone callback is already passive....
      const dbh = d3d.drag(); //.container(ndiv);
      dbh.on('start', (ev) => console.log('start', ev));
      dbh.on('drag.touchable', (ev, arg) => this.dragged(ev, arg));
      dbh.on('end', (ev) => console.log('end', ev));
      d3s.select(ndiv).call(dbh);
    }
  }

  dragged(ev: any, arg: any) {
    //d3-drag does prevent/stop anyway!
    //ev.sourceEvent.preventDefault();
    //ev.sourceEvent.stopImmediatePropagation();
    console.log('drag', ev, arg);
  }
}
