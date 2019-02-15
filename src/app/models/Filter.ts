export class Filter {
  Page: number;
  PerPage: number;
  OrderBy: string;

  constructor() {
    this.Page = 1;
    this.PerPage = 1;
    this.OrderBy = "asc";
  }
}
