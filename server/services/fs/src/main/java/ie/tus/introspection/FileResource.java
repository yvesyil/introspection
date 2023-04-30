package ie.tus.introspection;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import java.util.*;

@Path("/files")
public class FileResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<File> getAllFiles(
            @QueryParam("parentId") @DefaultValue("") String parentId
    ) {
        if (!parentId.isBlank()) {
            return getAllFilesByParentId(parentId);
        }
        FileDataAccessObject fdao = FileDataAccessObject.getInstance();
        return fdao.getAll();
    }

    private List<File> getAllFilesByParentId(String parentId) {
        FileDataAccessObject fdao = FileDataAccessObject.getInstance();
        return fdao.getFilesWhere("parentId", "int", parentId);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public File getFile(@PathParam("id") String id) {
        FileDataAccessObject fdao = FileDataAccessObject.getInstance();
        return fdao.get(Integer.parseInt(id));
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response postFile(File file) {
        FileDataAccessObject fdao = FileDataAccessObject.getInstance();
        Map<String, Object> body = new HashMap<>();
        Response.Status status;
        if (fdao.add(file)) {
            body.put("message", "File created");
            body.put("success", true);
            status = Response.Status.CREATED;
        } else {
            body.put("message", "Could not create file");
            body.put("success", false);
            status = Response.Status.BAD_REQUEST;
        }
        return Response.status(status).entity(body).build();
    }

    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public Response putFile(@PathParam("id") String id, File updatedFile) {
        FileDataAccessObject fdao = FileDataAccessObject.getInstance();
        Map<String, Object> body = new HashMap<>();
        Response.Status status;
        updatedFile.setId(Integer.parseInt(id));
        if (fdao.update(updatedFile)) {
            body.put("message", "File updated");
            body.put("success", true);
            status = Response.Status.OK;
        } else {
            body.put("message", "Could not update file");
            body.put("success", false);
            status = Response.Status.BAD_REQUEST;
        }
        return Response.status(status).entity(body).build();
    }

    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public Response deleteFile(@PathParam("id") String id) {
        FileDataAccessObject fdao = FileDataAccessObject.getInstance();
        Map<String, Object> body = new HashMap<>();
        Response.Status status;
        if (fdao.remove(Integer.parseInt(id))) {
            body.put("message", "Deleted file");
            body.put("success", true);
            status = Response.Status.NO_CONTENT;
        } else {
            body.put("message", "Could not delete file");
            body.put("success", false);
            status = Response.Status.BAD_REQUEST;
        }
        return Response.status(status).entity(body).build();
    }
}