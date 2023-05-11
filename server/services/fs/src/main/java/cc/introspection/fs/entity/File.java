package cc.introspection.fs.entity;

import jakarta.persistence.*;

@Entity
public class File {

    @Id
    @GeneratedValue
    private Long id;

    private Long userId;
    private String name;
    private String type;

    @Column(length = 30000)
    private String content;
    private Long parentId;

    public File() { }

    public File(Long userId, String name, String type, String content, Long parentId) {
        this.userId = userId;
        this.name = name;
        this.type = type;
        this.content = content;
        this.parentId = parentId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }
}
