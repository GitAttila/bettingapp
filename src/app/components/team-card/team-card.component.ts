import { Component, Input, OnInit } from '@angular/core';
import { IBetItem } from '../../models/bet.model';

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.scss']
})
export class TeamCardComponent implements OnInit {
  @Input()teamDataItem: IBetItem;

  ngOnInit() {
  }
}
