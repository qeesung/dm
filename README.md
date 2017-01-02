# dm

directory bookmark manager, you can add, remove, list, udpate, checkout , search your own bookmarks for directories. your can change directory quickly

## usage

### add

add a bookmark for a directory

```bash
dm add <name> [path] [-l <label>]
```

- name : bookmark name , **required**
- path : bookmark path， **optional**，default is current direcotry run the command
- -l <label>: bookmarks category， used to classify,  **optional**，default is `default` label

examples:

```bash
dm add b1 # add current directory as bookmark 'b1' with 'default' label
dm add tmp /tmp # add '/tmp' directory as bookmark 'tmp' with 'default' label
dm add work /mnt/disk1 -l test # add '/mnt/disk' as bookmark 'work' with 'test' label
```
