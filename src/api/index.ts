import axios from 'axios';
import { FetchReposParams, FetchReposResponse } from '../types';

export const getRepos = async ({ page }: FetchReposParams) => {
  return axios.get<FetchReposResponse[]>(
    `https://api.github.com/orgs/github/repos`,
    {
      params: {
        page,
      },
      headers: {
        Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
      },
    },
  );
};
