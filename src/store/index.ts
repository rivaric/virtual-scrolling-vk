import { makeAutoObservable, runInAction } from 'mobx';
import { getRepos } from '../api';
import { FetchReposParams, Repo } from '../types';

class UserStore {
  repos: Repo[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchItems({ page }: FetchReposParams) {
    this.loading = true;
    try {
      const { data } = await getRepos({
        page,
      });
      runInAction(() => {
        this.repos = [...this.repos, ...data];
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = 'Error fetch data';
        this.loading = false;
      });
    }
  }

  editItem(id: number, newName: string) {
    const item = this.repos.find((item) => item.id === id);
    if (item) {
      item.name = newName;
    }
  }

  deleteItem(id: number) {
    this.repos = this.repos.filter((item) => item.id !== id);
  }
}

const userStore = new UserStore();
export default userStore;
