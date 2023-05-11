package cc.introspection.fs;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Directory {

    @Id
    @GeneratedValue
    private Long id;
    private Long userId;
    private String name;
    private boolean root;
    private Long parentId;

    public Directory() {
        this.userId = null;
        this.root = false;
        this.parentId = null;
    }

    // Bare minimum directory
    public Directory(long userId, long parentId) {
        this.userId = userId;
        this.root = false;
        this.parentId = parentId;
    }

    public Directory(long userId, String name, boolean root, long parentId) {
        this.userId = userId;
        this.name = name;
        this.root = root;
        this.parentId = parentId;
    }

    public Long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
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


    public Long getParentId() {
        return parentId;
    }

    public void setParentId(long parentId) {
        this.parentId = parentId;
    }
}
