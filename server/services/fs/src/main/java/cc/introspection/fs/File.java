package cc.introspection.fs;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class File {

    @Id
    @GeneratedValue
    private Long id;

    private Long userId;
    private String name;
    private String type;
    private String content;
    private Long parentId;

    public File() {
        this.userId = null;
        this.name = "";
        this.type = "";
        this.content = "";
        this.parentId = null;
    }

    // Bare minimum file
    public File(long userId, String name, long parentId) {
        this.userId = userId;
        this.name = name;
        this.type = "text";
        this.content = "";
        this.parentId = parentId;
    }

    public File(long userId, String name, String type, String content, long parentId) {
        this.userId = userId;
        this.name = name;
        this.type = type;
        this.content = content;
        this.parentId = parentId;
    }

    public Long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getUserId() {
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

    public void setParentId(long parentId) {
        this.parentId = parentId;
    }
}
