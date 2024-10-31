export interface Repo {
  id: number;
  name: string;
}

export interface FetchReposParams {
  page: number;
}

export interface FetchReposResponse extends Repo {}
