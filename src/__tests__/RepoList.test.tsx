import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RepoList } from '../components/RepoList';
import { act } from 'react';
import userStore from '../store';

jest.mock('../store', () => ({
  repos: [
    { id: 1, name: 'Repo 1' },
    { id: 2, name: 'Repo 2' },
  ],
  error: null,
  loading: false,
  fetchItems: jest.fn(),
  editItem: jest.fn(),
  deleteItem: jest.fn(),
}));

describe('RepoList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders repository list', async () => {
    render(<RepoList />);

    expect(screen.getByText('List of repositories'));
    expect(screen.getByText('Name: Repo 1'));
    expect(screen.getByText('Name: Repo 2'));
  });

  it('displays error message if there is an error', () => {
    userStore.error = 'Error fetching repositories';
    render(<RepoList />);

    expect(screen.getByText('Error: Error fetching repositories'));
  });

  it('loads more items when scrolled to the end', () => {
    render(<RepoList />);
    act(() => {
      userStore.repos.push(
        { id: 3, name: 'Repo 3' },
        { id: 4, name: 'Repo 4' },
      );
    });
    expect(userStore.fetchItems).toHaveBeenCalled();
  });

  it('allows editing a repository name', async () => {
    render(<RepoList />);

    // Нажимаем кнопку редактирования
    fireEvent.click(screen.getAllByText('Edit')[0]);

    // Проверяем, что открылось поле ввода
    const input = screen.getByRole('textbox');
    expect(input);

    // Вводим новое значение и сохраняем
    fireEvent.change(input, { target: { value: 'Updated Repo 1' } });
    fireEvent.click(screen.getByText('Save'));

    // Проверяем, что вызвался метод editItem
    await waitFor(() =>
      expect(userStore.editItem).toHaveBeenCalledWith(1, 'Updated Repo 1'),
    );
  });

  it('deletes a repository', async () => {
    render(<RepoList />);

    // Нажимаем кнопку удаления
    fireEvent.click(screen.getAllByText('Delete')[0]);

    // Проверяем, что вызвался метод deleteItem
    await waitFor(() => expect(userStore.deleteItem).toHaveBeenCalledWith(1));
  });

  it('displays loading indicator while loading', () => {
    userStore.loading = true;
    render(<RepoList />);

    expect(screen.getByText('Loading...'));
  });
});
