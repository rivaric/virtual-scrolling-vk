import { useCallback, useEffect, useRef, useState } from 'react';
import { useFixedSizeList } from '../../utils';
import userStore from '../../store';
import { observer } from 'mobx-react';
import classes from './RepoList.module.css';
import { Button, TextField } from '@mui/material';
import classNames from 'classnames';

const itemHeight = 40;
const containerHeight = 600;

export const RepoList = observer(() => {
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const { virtualItems, totalHeight, endIndex } = useFixedSizeList({
    itemHeight: itemHeight,
    itemsCount: userStore.repos.length,
    listHeight: containerHeight,
    getScrollElement: useCallback(() => containerRef.current, []),
  });

  useEffect(() => {
    userStore.fetchItems({ page });
  }, [page]);

  useEffect(() => {
    if (endIndex === userStore.repos.length - 1) setPage((page) => page + 1);
  }, [endIndex]);

  const handleEditClick = (id: number, currentName: string) => {
    setEditingId(id);
    setEditingValue(currentName);
  };

  const handleSaveClick = (id: number) => {
    userStore.editItem(id, editingValue);
    setEditingId(null);
  };

  return (
    <>
      <h1>List of repositories</h1>
      <div ref={containerRef} className={classes['repo-list']}>
        {userStore.error && (
          <div className={classes['repo-list__error']}>
            Error: {userStore.error}
          </div>
        )}

        <div
          className={classes['repo-list__wrapper']}
          style={{
            position: 'relative',
            height: totalHeight,
          }}
        >
          {virtualItems.map((virtualItem) => {
            const item = userStore.repos[virtualItem.index];

            return (
              <div
                className={classes['repo-list__item']}
                key={item.id}
                style={{
                  transform: `translateY(${virtualItem.offsetTop}px)`,
                  height: itemHeight,
                }}
              >
                {editingId === item.id ? (
                  <div className={classes['repo-list__edit-mode']}>
                    <TextField
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleSaveClick(item.id)}
                      className={classes['repo-list__button--confirm']}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className={classes['repo-list__login']}>
                      Name: {item.name}
                    </span>
                    <div className={classes['repo-list__buttons']}>
                      <Button
                        variant="contained"
                        className={classNames(
                          classes['repo-list__button'],
                          classes['repo-list__button--edit'],
                        )}
                        onClick={() => handleEditClick(item.id, item.name)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        className={classNames(
                          classes['repo-list__button'],
                          classes['repo-list__button--delete'],
                        )}
                        onClick={() => userStore.deleteItem(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        {userStore.loading && (
          <div className={classes['repo-list__loading']}>Loading...</div>
        )}
      </div>
    </>
  );
});
