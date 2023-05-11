package cc.introspection.fs;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;


@ControllerAdvice
public class DirectoryNotFoundAdvice {

    @ResponseBody
    @ExceptionHandler(DirectoryNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String directoryNotFoundHandler(DirectoryNotFoundException exception) {
        return exception.getMessage();
    }
}
