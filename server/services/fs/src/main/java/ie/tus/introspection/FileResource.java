package ie.tus.introspection;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import jakarta.xml.bind.DatatypeConverter;

import java.security.MessageDigest;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

@Path("/files")
public class FileResource {

    private static String calculateEtag(List<File> files) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-256");

        ObjectMapper mapper = new ObjectMapper();
        String serialized = mapper.writeValueAsString(files);

        byte[] hash = md.digest(serialized.getBytes());

        return DatatypeConverter.printHexBinary(hash);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllFiles(
            @QueryParam("parentId") @DefaultValue("") String parentId,
            @Context Request request
    ) {
        List<File> files;

        if (!parentId.isBlank()) {
            files = getAllFilesByParentId(parentId);
        } else {
            FileDataAccessObject fdao = FileDataAccessObject.getInstance();
            files = fdao.getAll();
        }

        try {
            EntityTag etag = new EntityTag(calculateEtag(files));

            // set the cache control headers for the response
            CacheControl cc = new CacheControl();
            cc.setNoCache(false);
            cc.setPrivate(true);
            cc.setMustRevalidate(true);
            cc.setMaxAge(60 * 60); // 1 hour

            // check if the client has a matching entity tag
            Response.ResponseBuilder builder = request.evaluatePreconditions(etag);
            if (builder != null) {
                // client has a matching entity tag, return a 304 Not Modified response
                return builder.cacheControl(cc).build();
            }
            // client does not have a matching entity tag, return a full response
            return Response.ok(files).cacheControl(cc).tag(etag).build();
        } catch (Exception exception) {
            exception.printStackTrace();
            return Response.serverError().build();
        }
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
            status = Response.Status.OK;
        } else {
            body.put("message", "Could not delete file");
            body.put("success", false);
            status = Response.Status.BAD_REQUEST;
        }
        return Response.status(status).entity(body).build();
    }
}