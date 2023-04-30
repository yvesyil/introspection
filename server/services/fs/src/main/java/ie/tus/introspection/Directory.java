package ie.tus.introspection;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Directory {
    private Integer id;
    private Integer userId;
    private String name;
    private boolean root;
    private DirectoryTree tree;
    private Integer parentId;

    public Directory() {
        this.id = null;
        this.userId = null;
        this.root = false;
        this.tree = new DirectoryTree();
        this.parentId = null;
    }

    // Bare minimum directory
    public Directory(int userId, int parentId) {
        this.id = null;
        this.userId = userId;
        this.root = false;
        this.tree = new DirectoryTree();
        this.parentId = parentId;
    }

    public Directory(Integer id, int userId, String name, boolean root, Integer parentId) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.root = root;
        this.tree = new DirectoryTree();
        this.parentId = parentId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isRoot() {
        return root;
    }

    public void setRoot(boolean root) {
        this.root = root;
    }

    public DirectoryTree getTree() {
        return tree;
    }

    public void setTree(DirectoryTree tree) {
        this.tree = tree;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }
}
