export class Article {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly text: string,
    public readonly publishedAt: Date,
  ) {}
}
