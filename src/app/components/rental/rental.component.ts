import { ImageService } from 'app/image.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../types/user';
import { Product } from '../../types/product';
import { Order } from '../../types/order';
import * as moment from 'moment';

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.scss']
})
export class RentalComponent implements OnInit {

  order: Order;
  product: Product;
  rentor: User;
  quantity: number;
  count: number;
  from: Date;
  to: Date;
  one_day = 1000 * 60 * 60 * 24;
  one_hour = 1000 * 60 * 60;

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private imageService: ImageService
  ) { }

  ngOnInit() {
    this.orderService.getOrderById(this.activatedRoute.snapshot.params.id)
      .catch(err => {
        return Observable.throw(new Error(`${err.status} ${err.msg}`));
      })
      .subscribe(order => {
        this.order = order[0];
        this.quantity = this.order.quantity;
        this.userService.getById(this.order._rentorId)
          .catch(err => {
            return Observable.throw(new Error(`${err.status} ${err.msg}`));
          })
          .subscribe(rentor => {
            this.rentor = rentor[0];
          });

        this.productService.getById(this.order._productId)
          .catch(err => {
            return Observable.throw(new Error(`${err.status} ${err.msg}`));
          })
          .subscribe(product => {
            this.product = product[0];
            this.periodCount();
          });
      })
  }

  periodCount(): void {
    this.from = new Date(this.order.fromDateYear, this.order.fromDateMonth, this.order.fromDateDay);
    this.to = new Date(this.order.toDateYear, this.order.toDateMonth, this.order.toDateDay);
    if (this.product.pricePer == 'Day') {
      var from = moment(this.from);
      var to = moment(this.to);
      this.count = to.diff(from, 'days') + 1;
    }
    else if (this.product.pricePer == 'Hour') {
      this.count = (this.to.getTime() - this.from.getTime()) / this.one_hour;
    }
    else {
      this.count = 0;
    }
  }


  cancelOrder(): void {
    this.order.status = 'canceled';
    this.product.available += this.order.quantity;

    this.productService.update(this.product, this.product._id)
      .catch(err => {
        return Observable.throw(new Error(`${err.status} ${err.msg}`));
      })
      .subscribe(() => {
      });

    this.orderService.update(this.order, this.activatedRoute.snapshot.params.id)
      .catch(err => {
        return Observable.throw(new Error(`${err.status} ${err.msg}`));
      })
      .subscribe(() => {
      });

    this.router.navigate(['dashboard/my-orders']);
  }

  get mainImageUrl(): string {
    return this.product ? this.imageService.getImageUrl(this.product.images[0]) : '';
  }

}
