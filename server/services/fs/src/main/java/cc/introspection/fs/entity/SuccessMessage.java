package cc.introspection.fs.entity;

public class SuccessMessage {
    private Boolean success;
    private String message;

    public SuccessMessage() { }

    public SuccessMessage(Boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getStatus() {
        return success;
    }

    public void setStatus(Boolean success) {
        this.success = success;
    }
}
